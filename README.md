# Obsidian Simple File Push Blog 

Obsidian plugin that simply push markdown file to POST endpoint. <br/>
Forked from https://github.com/yiglas/obsidian-file-publisher

## Server side
You must provide simple POST API endpoint that able to receive this following `multipart/form-data` data:
```
file_name: {{will be filled with file name}}
content: {{will be filled with file content}}
```
The API protected by Bearer Authorization `Bearer YOUR_TOKEN`. 

## Plugin Settings
- Enter the POST endpoint URL (eg. https://huedaya.com/api/obsidian-blog/sync)
- Enter the API key (eg. `test`)

## Create a new file to post
Simply click on the Note and select `Sync file to my Blog`

## Debug
- If the request fail, please open the developer window

## Todo
- [ ] Able to read meta data like title
- [ ] Create repo for the server side sample