--------------------------------- Ultima vers:

CREATE TABLE utilizator (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    nume VARCHAR(100),
    prenume VARCHAR(100),
    username VARCHAR(40) UNIQUE,
    email VARCHAR(100) UNIQUE,
    parola VARCHAR(200),
    tara_origine VARCHAR(100),
    telefon VARCHAR(12),
    poza_profil VARCHAR(100),
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
    instructiuni VARCHAR(700),
    cale_poza VARCHAR(200),
    cale_video VARCHAR(200),
    dificultate VARCHAR(20),
	participa_concurs BOOLEAN DEFAULT FALSE,
    colectie_id INTEGER REFERENCES colectie(id),
	bucatarie_id INTEGER REFERENCES bucatarie(id),
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint reteta_pk PRIMARY KEY(id)
    --,CONSTRAINT check_dificultate_values CHECK (dificultate IN ('easy', 'intermediate', 'hard', 'extra hard' ))
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
    --,CONSTRAINT check_stadiu_values CHECK (stadiu IN ('active', 'closed'))
);

CREATE TABLE reactie_reteta (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    utilizator_id INTEGER,
    reteta_id INTEGER,
    reactie VARCHAR(50),
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),
    FOREIGN KEY (reteta_id) REFERENCES reteta(id),
    created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
    constraint reactie_reteta_pk PRIMARY KEY(id),
    UNIQUE (utilizator_id, reteta_id)
    --,CONSTRAINT check_reactie_values CHECK (reactie IN ('like', 'dislike'))
);

ALTER TABLE reactie_reteta
ADD CONSTRAINT unique_like
UNIQUE(reteta_id,utilizator_id);

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

CREATE TABLE notificare (
    id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
    text VARCHAR(200),
    info VARCHAR(700), 
    categorie VARCHAR(20),
	citita BOOLEAN DEFAULT FALSE,
    utilizator_id INTEGER REFERENCES utilizator(id),
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	deleted_at timestamptz NULL DEFAULT null,
	constraint notificare_pk PRIMARY KEY(id)
);

ALTER TABLE reteta
ALTER COLUMN ingrediente TYPE TEXT[] USING ARRAY[ingrediente];

-- ALTER TABLE reteta
-- ADD COLUMN dificultate VARCHAR(10);

CREATE INDEX idx_reteta_colectie_id ON reteta (colectie_id);
CREATE INDEX idx_colectie_utilizator_id ON colectie (utilizator_id);
CREATE INDEX idx_colectie_publica ON colectie (publica);
CREATE INDEX idx_notificare_id ON notificare (utilizator_id);

CREATE INDEX idx_utilizator_id_publica ON colectie (utilizator_id, publica);

CREATE INDEX idx_reteta_participa_concurs_bucatarie
ON reteta (participa_concurs, bucatarie_id)
WHERE participa_concurs = true;

CREATE OR REPLACE VIEW reteta_feed AS
SELECT 
    r.id,
    r.titlu_reteta,
    r.cale_poza,
    r.dificultate,
    r.created_at,
    COALESCE(reactii_count.nr_likes, 0) AS nr_reactii,
    COALESCE(comentarii_count.nr_comments, 0) AS nr_comentarii,
    u.username,
    u.poza_profil
FROM 
    reteta r
LEFT JOIN 
    (SELECT reteta_id, COUNT(*) AS nr_likes FROM reactie_reteta GROUP BY reteta_id) reactii_count
ON 
    r.id = reactii_count.reteta_id
LEFT JOIN 
    (SELECT reteta_id, COUNT(*) AS nr_comments FROM comentariu GROUP BY reteta_id) comentarii_count
ON 
    r.id = comentarii_count.reteta_id
LEFT JOIN
    colectie c
ON
    r.colectie_id = c.id
LEFT JOIN
    utilizator u
ON
    c.utilizator_id = u.id;
