According to Spring and Mongo, Tailable cursors may become dead, or invalid, if either the query returns no match or the cursor returns the document at the “end” of the collection and the application then deletes that document.


Therefore, after creating the capped collection, we should find all data and filter it to return appropriate data for the client.