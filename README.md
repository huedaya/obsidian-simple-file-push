# Obsidian Simple File Push Blog 

Obsidian plugin that simply push markdown file to POST endpoint. <br/>
Forked from https://github.com/yiglas/obsidian-file-publisher

## Server side
You must provide a simple POST API endpoint that is able to receive the following `JSON` data:
```json
{
    "file_name": "{{will be filled with file name}}"
    "content": "{{will be filled with file content}}"
}
```
The API must be protected by Bearer Authorization `Bearer YOUR_TOKEN`. 

## Plugin Settings
- Enter the POST endpoint URL (eg. https://huedaya.com/api/obsidian-blog/sync)
- Enter the API key (eg. `test`)

## Create a new file to post
Simply click on the Note and select `Sync file to my Blog`

## Debug
- If the request fails, please open the developer window `View > Toggle Developer Tools`.

## Todo
- [ ] Create repo for the server side sample

## Support
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/huedya)