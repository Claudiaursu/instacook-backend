import { ViewEntity, ViewColumn } from "typeorm"

@ViewEntity({
    expression: `
      CREATE OR REPLACE VIEW reteta_feed AS
      SELECT 
          r.id,
          r.titlu_reteta,
          r.cale_poza,
          r.dificultate,
          COALESCE(reactii_count.nr_likes, 0) AS nr_reactii,
          COALESCE(comentarii_count.nr_comments, 0) AS nr_comentarii
      FROM 
          reteta r
      LEFT JOIN 
          (SELECT reteta_id, COUNT(*) AS nr_likes FROM reactie_reteta GROUP BY reteta_id) reactii_count
      ON 
          r.id = reactii_count.reteta_id
      LEFT JOIN 
          (SELECT reteta_id, COUNT(*) AS nr_comments FROM comentariu GROUP BY reteta_id) comentarii_count
      ON 
          r.id = comentarii_count.reteta_id;
    `,
    name: 'reteta_feed',
    schema: 'public',
    database: 'instacook'
})
export class RecipeViewEntity {
  @ViewColumn()
  id: number

  @ViewColumn()
  titlu_reteta: string
  
  @ViewColumn()
  cale_poza: string

  @ViewColumn()
  dificultate: string

  @ViewColumn()
  nr_reactii: number

  @ViewColumn()
  nr_comentarii: number

  @ViewColumn()
  created_at: Date
}