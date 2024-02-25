--------------------------------- Ultima vers:

CREATE TABLE utilizator (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    nume VARCHAR(100),
    prenume VARCHAR(100),
    email VARCHAR(100),
    parola VARCHAR(200),
    tara_origine VARCHAR(100),
    telefon VARCHAR(12),
    total_puncte INTEGER CHECK (total_puncte >= 0),
    created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	CONSTRAINT utilizator_pk PRIMARY KEY(id)
);

CREATE TABLE urmarire (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    urmaritor_id INTEGER REFERENCES utilizator(id),
    urmarit_id INTEGER REFERENCES utilizator(id),
    created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint urmarire_pk PRIMARY KEY(id)
);

CREATE TABLE colectie (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    titlu_colectie VARCHAR(100),
    descriere_colectie VARCHAR(400),
    publica BOOLEAN DEFAULT FALSE,
    cale_poza VARCHAR(200),
    utilizator_id INTEGER REFERENCES utilizator(id),
    created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint colectie_pk PRIMARY KEY(id)
);


CREATE TABLE bucatarie (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    nume_bucatarie VARCHAR(100),
    descriere_bucatarie VARCHAR(400),
    regiune_glob VARCHAR(70),
    created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint bucatarie_pk PRIMARY KEY(id)
);

CREATE TABLE reteta (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    titlu_reteta VARCHAR(100),
    ingrediente VARCHAR(400),
    instructiuni VARCHAR(400),
    cale_poza VARCHAR(200),
    cale_video VARCHAR(200),
	participa_concurs BOOLEAN DEFAULT FALSE,
    colectie_id INTEGER REFERENCES colectie(id),
	bucatarie_id INTEGER REFERENCES bucatarie(id),
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint reteta_pk PRIMARY KEY(id)
);

CREATE TABLE concurs (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    titlu_concurs VARCHAR(100),
    data_inceput DATE,
    data_sfarsit DATE,
    stadiu VARCHAR(50),
    puncte_oferite INTEGER CHECK (puncte_oferite >= 0),
    reteta_castigatoare_id INTEGER REFERENCES reteta(id),
	bucatarie_id INTEGER REFERENCES bucatarie(id),
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint concurs_pk PRIMARY KEY(id)
);

CREATE TABLE reactie_reteta (
    id_utilizator INTEGER,
    id_reteta INTEGER,
    reactie VARCHAR(50),
    PRIMARY KEY (id_utilizator, id_reteta),
    FOREIGN KEY (id_utilizator) REFERENCES utilizator(id),
    FOREIGN KEY (id_reteta) REFERENCES reteta(id),
    created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null
);

CREATE TABLE comentariu (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    text VARCHAR(400),
    data_postare DATE,
    utilizator_id INTEGER REFERENCES utilizator(id),
	reteta_id INTEGER REFERENCES reteta(id),
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint comentariu_pk PRIMARY KEY(id)
);

ALTER TABLE reteta
ALTER COLUMN ingrediente TYPE TEXT[] USING ARRAY[ingrediente];

ALTER TABLE reteta
ADD COLUMN dificultate VARCHAR(10);

