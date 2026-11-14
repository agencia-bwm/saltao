-- Plataforma Saltão (motor de reservas + sistema interno) — esquema inicial.
-- MySQL 8 / MariaDB 10.6+ (Hostinger). InnoDB, utf8mb4. Valores em centavos (INT) para não ter erro de arredondamento.
-- Modelo genérico (briefing seção 9 + decisões 14–17): produto cobra por dia ou noite, por pessoa/espaço/unidade,
-- e consome estoque de "recursos" (cada apartamento, cada quiosque, cada área de camping, a lotação do Day Use).

SET NAMES utf8mb4;

CREATE TABLE politica (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  cancelamento_horas_min INT NOT NULL DEFAULT 48,      -- cancela sem custo até X horas antes
  reembolso_percentual TINYINT UNSIGNED NOT NULL DEFAULT 100,
  alteracao_data_permitida BOOLEAN NOT NULL DEFAULT TRUE,
  texto TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE produto (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(60) NOT NULL UNIQUE,                     -- = motorProdutoId no painel
  nome VARCHAR(120) NOT NULL,
  cobranca ENUM('dia','noite') NOT NULL,
  unidade ENUM('pessoa','espaco','unidade') NOT NULL,   -- pessoa: Day Use/camping; espaco: quiosque; unidade: apartamento
  combo BOOLEAN NOT NULL DEFAULT FALSE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  politica_id INT UNSIGNED NULL,
  CONSTRAINT fk_produto_politica FOREIGN KEY (politica_id) REFERENCES politica(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- O que o cliente escolhe nos espaços (decisão 16): ex. "Quiosques beira-rio, até 30 pessoas".
CREATE TABLE setor (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produto_id INT UNSIGNED NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,                     -- = setorMotorId no painel
  nome VARCHAR(120) NOT NULL,
  capacidade_pessoas INT UNSIGNED NULL,
  CONSTRAINT fk_setor_produto FOREIGN KEY (produto_id) REFERENCES produto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tudo que tem estoque. capacidade = 1 para espaços/apartamentos; = lotação para Day Use/áreas de camping.
CREATE TABLE recurso (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produto_id INT UNSIGNED NOT NULL,
  setor_id INT UNSIGNED NULL,
  codigo VARCHAR(30) NOT NULL,                          -- ex.: Q-12, APTO-3, DAYUSE
  capacidade INT UNSIGNED NOT NULL DEFAULT 1,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_recurso_codigo (produto_id, codigo),
  KEY ix_recurso_setor (setor_id, ativo),
  CONSTRAINT fk_recurso_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
  CONSTRAINT fk_recurso_setor FOREIGN KEY (setor_id) REFERENCES setor(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Combos herdam o estoque dos itens.
CREATE TABLE combo_item (
  combo_id INT UNSIGNED NOT NULL,
  produto_id INT UNSIGNED NOT NULL,
  quantidade INT UNSIGNED NOT NULL DEFAULT 1,
  dia_offset TINYINT UNSIGNED NOT NULL DEFAULT 0,       -- ex.: day use no dia seguinte ao check-in
  PRIMARY KEY (combo_id, produto_id, dia_offset),
  CONSTRAINT fk_combo_combo FOREIGN KEY (combo_id) REFERENCES produto(id),
  CONSTRAINT fk_combo_produto FOREIGN KEY (produto_id) REFERENCES produto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faixa_etaria (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(30) NOT NULL UNIQUE,                     -- inteira, meia, gratis...
  nome VARCHAR(60) NOT NULL,
  idade_min TINYINT UNSIGNED NOT NULL,
  idade_max TINYINT UNSIGNED NOT NULL,
  conta_lotacao BOOLEAN NOT NULL DEFAULT TRUE           -- bebê de colo pode não contar
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE feriado (
  data DATE PRIMARY KEY,
  nome VARCHAR(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Preço por data: a tarifa válida de maior prioridade vence (feriado > fim de semana > temporada > base).
CREATE TABLE tarifa (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produto_id INT UNSIGNED NOT NULL,
  faixa_etaria_id INT UNSIGNED NULL,                    -- NULL = vale para todas (espaços/unidades)
  tipo ENUM('base','temporada','fim_de_semana','feriado') NOT NULL,
  data_inicio DATE NULL,
  data_fim DATE NULL,
  dias_semana SET('1','2','3','4','5','6','7') NULL,    -- ISO: 1 = segunda ... 7 = domingo
  valor_centavos INT UNSIGNED NOT NULL,
  prioridade TINYINT UNSIGNED NOT NULL,
  KEY ix_tarifa_produto (produto_id, tipo),
  CONSTRAINT fk_tarifa_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
  CONSTRAINT fk_tarifa_faixa FOREIGN KEY (faixa_etaria_id) REFERENCES faixa_etaria(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cupom (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  tipo ENUM('percentual','valor') NOT NULL,
  valor INT UNSIGNED NOT NULL,                          -- % ou centavos
  valido_de DATE NULL,
  valido_ate DATE NULL,
  limite_usos INT UNSIGNED NULL,
  usos INT UNSIGNED NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cliente (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  telefone VARCHAR(30) NULL,
  consentimento_lgpd_em DATETIME NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_cliente_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reserva (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo CHAR(8) NOT NULL UNIQUE,                       -- exibido ao cliente e no voucher
  cliente_id INT UNSIGNED NULL,
  status ENUM('hold','pendente_pagamento','confirmada','cancelada','expirada','utilizada','estorno_pendente') NOT NULL,
  canal ENUM('online','balcao') NOT NULL DEFAULT 'online',
  expira_em DATETIME NULL,                              -- hold de 15 min
  subtotal_centavos INT UNSIGNED NOT NULL DEFAULT 0,
  desconto_centavos INT UNSIGNED NOT NULL DEFAULT 0,
  total_centavos INT UNSIGNED NOT NULL DEFAULT 0,
  cupom_id INT UNSIGNED NULL,
  utm JSON NULL,                                        -- origem da venda (source/medium/campaign, gclid, fbclid)
  ga_client_id VARCHAR(60) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmado_em DATETIME NULL,
  KEY ix_reserva_status_expira (status, expira_em),
  CONSTRAINT fk_reserva_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  CONSTRAINT fk_reserva_cupom FOREIGN KEY (cupom_id) REFERENCES cupom(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reserva_item (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reserva_id INT UNSIGNED NOT NULL,
  produto_id INT UNSIGNED NOT NULL,
  setor_id INT UNSIGNED NULL,
  faixa_etaria_id INT UNSIGNED NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,                               -- exclusivo para noites; = data_inicio + 1 para dia
  quantidade INT UNSIGNED NOT NULL,
  valor_centavos INT UNSIGNED NOT NULL,
  KEY ix_item_reserva (reserva_id),
  CONSTRAINT fk_item_reserva FOREIGN KEY (reserva_id) REFERENCES reserva(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES produto(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contador de estoque por recurso e dia. É a linha travada (SELECT ... FOR UPDATE) no hold:
-- duas compras simultâneas do mesmo espaço disputam a mesma linha e só uma passa.
CREATE TABLE estoque_dia (
  recurso_id INT UNSIGNED NOT NULL,
  data DATE NOT NULL,
  capacidade INT UNSIGNED NOT NULL,
  usado INT UNSIGNED NOT NULL DEFAULT 0,
  bloqueado BOOLEAN NOT NULL DEFAULT FALSE,             -- manutenção/evento fechado
  PRIMARY KEY (recurso_id, data),
  CONSTRAINT ck_estoque CHECK (usado <= capacidade),
  CONSTRAINT fk_estoque_recurso FOREIGN KEY (recurso_id) REFERENCES recurso(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Qual item ocupa qual recurso em qual dia (o voucher mostra o número do espaço).
CREATE TABLE ocupacao (
  reserva_item_id INT UNSIGNED NOT NULL,
  recurso_id INT UNSIGNED NOT NULL,
  data DATE NOT NULL,
  quantidade INT UNSIGNED NOT NULL,
  PRIMARY KEY (reserva_item_id, recurso_id, data),
  KEY ix_ocupacao_recurso (recurso_id, data),
  CONSTRAINT fk_ocup_item FOREIGN KEY (reserva_item_id) REFERENCES reserva_item(id) ON DELETE CASCADE,
  CONSTRAINT fk_ocup_recurso FOREIGN KEY (recurso_id) REFERENCES recurso(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pagamento (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reserva_id INT UNSIGNED NOT NULL,
  gateway VARCHAR(20) NOT NULL,                         -- mercadopago | asaas | pagarme
  gateway_pagamento_id VARCHAR(80) NOT NULL,
  metodo ENUM('pix','cartao') NOT NULL,
  status ENUM('pendente','aprovado','recusado','expirado','estornado') NOT NULL,
  valor_centavos INT UNSIGNED NOT NULL,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pagamento_gateway (gateway, gateway_pagamento_id),
  CONSTRAINT fk_pag_reserva FOREIGN KEY (reserva_id) REFERENCES reserva(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Idempotência dos webhooks: o mesmo evento do gateway nunca é processado duas vezes.
CREATE TABLE webhook_evento (
  gateway VARCHAR(20) NOT NULL,
  evento_id VARCHAR(120) NOT NULL,
  recebido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resultado VARCHAR(40) NULL,
  PRIMARY KEY (gateway, evento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE voucher (
  reserva_id INT UNSIGNED PRIMARY KEY,
  qr_token CHAR(43) NOT NULL UNIQUE,                    -- 32 bytes aleatórios em base64url
  usado_em DATETIME NULL,
  usado_por INT UNSIGNED NULL,
  CONSTRAINT fk_voucher_reserva FOREIGN KEY (reserva_id) REFERENCES reserva(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Sistema interno ----------
CREATE TABLE usuario (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(200) NOT NULL,                     -- argon2id/scrypt
  papel ENUM('admin','gerente','portaria','lanchonete') NOT NULL,
  totp_secret VARCHAR(64) NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE checkin (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reserva_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_checkin_reserva FOREIGN KEY (reserva_id) REFERENCES reserva(id),
  CONSTRAINT fk_checkin_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE estoque_item (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  unidade VARCHAR(10) NOT NULL DEFAULT 'un',
  saldo DECIMAL(12,3) NOT NULL DEFAULT 0,
  minimo DECIMAL(12,3) NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE estoque_movimento (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  tipo ENUM('entrada','saida','ajuste') NOT NULL,
  quantidade DECIMAL(12,3) NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  obs VARCHAR(200) NULL,
  em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mov_item FOREIGN KEY (item_id) REFERENCES estoque_item(id),
  CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NULL,
  acao VARCHAR(40) NOT NULL,
  entidade VARCHAR(40) NOT NULL,
  entidade_id VARCHAR(40) NULL,
  dados JSON NULL,
  em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY ix_audit_entidade (entidade, entidade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
