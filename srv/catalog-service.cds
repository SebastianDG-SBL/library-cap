using library as db from '../db/schema';

service CatalogService @(path: '/catalog') {
    entity Authors as projection on db.Authors;


    entity Books   as
        projection on db.Books {
            *,

            @EndUserText.label: 'AvailabileCopies'
            0 as availableStock : Integer,
        };


}
