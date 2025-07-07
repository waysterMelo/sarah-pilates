-- Criação das tabelas principais do sistema Sarah Pilates

-- Tabela de usuários
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'INSTRUCTOR', 'RECEPTIONIST') NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de alunos
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    medical_history TEXT,
    objectives TEXT,
    plan VARCHAR(100) NOT NULL DEFAULT 'Mensal - 8 aulas',
    status ENUM('ATIVO', 'INATIVO', 'SUSPENSO') NOT NULL DEFAULT 'ATIVO',
    registration_date DATE NOT NULL,
    last_class TIMESTAMP NULL,
    total_classes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de instrutores
CREATE TABLE instructors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    rg VARCHAR(20) NOT NULL,
    cref_number VARCHAR(20),
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    hourly_rate DECIMAL(8,2),
    status ENUM('ATIVO', 'INATIVO', 'LICENCA', 'DEMITIDO') NOT NULL DEFAULT 'ATIVO',
    notes TEXT,
    total_classes INT NOT NULL DEFAULT 0,
    total_students INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de especializações dos instrutores
CREATE TABLE instructor_specializations (
    instructor_id BIGINT NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Tabela de agendamentos
CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    instructor_id BIGINT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Pilates Solo',
    status ENUM('AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO', 'FALTA') NOT NULL DEFAULT 'AGENDADO',
    notes TEXT,
    room VARCHAR(50) NOT NULL DEFAULT 'Sala 1',
    price DECIMAL(8,2) NOT NULL,
    payment_status ENUM('PENDENTE', 'PAGO', 'ISENTO') NOT NULL DEFAULT 'PENDENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Tabela de equipamentos dos agendamentos
CREATE TABLE schedule_equipment (
    schedule_id BIGINT NOT NULL,
    equipment VARCHAR(255) NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

-- Tabela de avaliações físicas
CREATE TABLE physical_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    instructor_id BIGINT NOT NULL,
    date DATE NOT NULL,
    type ENUM('INICIAL', 'PROGRESSO', 'FINAL', 'MEDICA') NOT NULL DEFAULT 'INICIAL',
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(3,2) NOT NULL,
    bmi DECIMAL(4,1),
    blood_pressure VARCHAR(20),
    heart_rate INT,
    body_fat DECIMAL(4,1),
    muscle_mass DECIMAL(5,2),
    chest_measurement INT,
    waist_measurement INT,
    hip_measurement INT,
    thigh_measurement INT,
    arm_measurement INT,
    shoulder_flexion INT,
    spinal_flexion INT,
    hip_flexion INT,
    ankle_flexion INT,
    core_strength INT,
    upper_body_strength INT,
    lower_body_strength INT,
    grip_strength INT,
    static_balance INT,
    dynamic_balance INT,
    proprioception INT,
    head_posture TEXT,
    shoulders_posture TEXT,
    spine_posture TEXT,
    pelvis_posture TEXT,
    knees_posture TEXT,
    feet_posture TEXT,
    medical_observations TEXT,
    objectives TEXT,
    treatment_plan TEXT,
    recommendations TEXT,
    next_evaluation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Tabela de fotos das avaliações
CREATE TABLE evaluation_photos (
    evaluation_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (evaluation_id) REFERENCES physical_evaluations(id) ON DELETE CASCADE
);

-- Tabela de anexos das avaliações
CREATE TABLE evaluation_attachments (
    evaluation_id BIGINT NOT NULL,
    attachment_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (evaluation_id) REFERENCES physical_evaluations(id) ON DELETE CASCADE
);

-- Tabela de fichas de evolução
CREATE TABLE evolution_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    instructor_id BIGINT NOT NULL,
    date DATE NOT NULL,
    session INT NOT NULL,
    focus VARCHAR(255) NOT NULL,
    progress_notes TEXT,
    difficulties_observed TEXT,
    improvements TEXT,
    next_session_goals TEXT,
    overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
    pain_level INT CHECK (pain_level >= 0 AND pain_level <= 10),
    mobility_level INT CHECK (mobility_level >= 1 AND mobility_level <= 5),
    strength_level INT CHECK (strength_level >= 1 AND strength_level <= 5),
    balance_level INT CHECK (balance_level >= 1 AND balance_level <= 5),
    endurance_level INT CHECK (endurance_level >= 1 AND endurance_level <= 5),
    observations TEXT,
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Tabela de exercícios das fichas de evolução
CREATE TABLE evolution_exercises (
    evolution_id BIGINT NOT NULL,
    exercise VARCHAR(255) NOT NULL,
    FOREIGN KEY (evolution_id) REFERENCES evolution_records(id) ON DELETE CASCADE
);

-- Tabela de equipamentos das fichas de evolução
CREATE TABLE evolution_equipment (
    evolution_id BIGINT NOT NULL,
    equipment VARCHAR(255) NOT NULL,
    FOREIGN KEY (evolution_id) REFERENCES evolution_records(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_instructors_email ON instructors(email);
CREATE INDEX idx_instructors_cpf ON instructors(cpf);
CREATE INDEX idx_instructors_status ON instructors(status);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_schedules_student ON schedules(student_id);
CREATE INDEX idx_schedules_instructor ON schedules(instructor_id);
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_physical_evaluations_student ON physical_evaluations(student_id);
CREATE INDEX idx_physical_evaluations_date ON physical_evaluations(date);
CREATE INDEX idx_evolution_records_student ON evolution_records(student_id);
CREATE INDEX idx_evolution_records_date ON evolution_records(date);

-- Inserir usuário admin padrão
INSERT INTO users (name, email, password, role, active) 
VALUES ('Administrador', 'admin@sarahpilates.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', TRUE);
-- Senha: admin123