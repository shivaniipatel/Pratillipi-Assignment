

class ArticleQuery {

    static insertArticles(articles) {
        return db.from('public.articles')
            .insert(articles);
    }


    static getCappedArticles(authorIds, articlesLimit) {
        return db.raw(`
            select a.author_id as authorid, a.id as articleid, a.title as title, a.created_at as articlecreatedat
            from (
                select 
                    a.*,
                    row_number() over (partition by a.author_id order by created_at desc) as seqnum
                from articles a 
                where a.author_id in (${authorIds})
                    and a.is_active = true 
                ) a
            where seqnum <= ${articlesLimit}
            order by a.author_id, a.created_at
        `)

    }

}

module.exports = ArticleQuery;