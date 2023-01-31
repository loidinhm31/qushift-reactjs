According to Spring and Mongo, Tailable cursors may become dead, or invalid, if either the query returns no match or the cursor returns the document at the “end” of the collection and the application then deletes that document.

Create Capped collection with a size of 512 bytes for approximately 2 items only.

Therefore, after creating the capped collection for streaming messages, as we call "stream-messages", we should add an item with a default field "topicId" with value "INIT_STREAM". 