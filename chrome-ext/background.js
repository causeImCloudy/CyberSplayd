let textables=["Nothing Appears Malicious. No further actions recommended.","Standard spam email usually delivered via mailing lists. Nothing Appears Malicious. No further actions recommended.", "Spam marketing email attempting to sell something. Nothing appears to be malicious. No further action recommended.", "Thank you,\nCarter Loyd\nSecurity Analyst\nFishtech CYDERES" ]


// create a context menu
//===========================//
/*
* Page Operations
*/
chrome.contextMenus.create({
    "id": "PageOps",
    "title": "Page Ops",
    "contexts": ["selection", "link"]
});

//===========================//
/*
* Common Responses.
*/
chrome.contextMenus.create({
    "id": "common",
    "title": "Common Phrase",
    "contexts": ["all"]
});
//================
//STARTING PHRASES
//================
chrome.contextMenus.create({
    "id": "1",
    "parentId": "common",
    "title": "No & No",
    "contexts": ["all"]
});
chrome.contextMenus.create({
    "id": "2",
    "parentId": "common",
    "title": "Standard Spam",
    "contexts": ["all"]
});
chrome.contextMenus.create({
    "id": "3",
    "parentId": "common",
    "title": "Marketing Spam",
    "contexts": ["all"]
});
chrome.contextMenus.create({
    "id": "4",
    "parentId": "common",
    "title": "Signature",
    "contexts": ["all"]
});
chrome.contextMenus.create({
    "id": "handled",
    "parentId": "common",
    "title": "Handled in console.",
    "contexts": ["all"]
});



//===========================//
/*
* Macros.
*/
chrome.contextMenus.create({
    "id": "macros",
    "title": "Macros",
    "contexts": ["all"]
});
//+++++++++++++++++++++++++++//
chrome.contextMenus.create({
    "id": "sanitize",
    "parentId": "macros",
    "title": "Defang URL",
    "contexts": ["selection"]
});
chrome.contextMenus.create({
    "id": "refang",
    "parentId": "macros",
    "title": "Refang URL",
    "contexts": ["selection"]
});
chrome.contextMenus.create({
    "id": "encode64",
    "parentId": "macros",
    "title": "Base64 Encode",
    "contexts": ["selection"]
});
chrome.contextMenus.create({
    "id": "decode64",
    "parentId": "macros",
    "title": "Base64 Decode",
    "contexts": ["selection"]
});
chrome.contextMenus.create({
    "id": "decodePPURL",
    "parentId": "macros",
    "title": "PP Decode",
    "contexts": ["selection"]
});


//=======================================================================//
// creates base64 obj
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


// create empty artifact variable
var artifact = "";

function refangURL(artifact) {
    if(artifact.includes("[.]")) {
        artifact = artifact.replace(/\[\.\]/g, ".");
    }

    if(artifact.includes("hxxp://")) {
        artifact = artifact.replace("hxxp://", "http://");
    }

    if(artifact.includes("hxxps://")) {
        artifact = artifact.replace("hxxps://", "https://");
    }
    return artifact;
}
function defangURL(artifact)
{
    if(artifact.includes(".")) {
        artifact = artifact.replace(/\./g, "[.]");
    }

    if(artifact.includes("http://")) {
        artifact = artifact.replace ("http://", "hxxp://");
    }

    if(artifact.includes("https://")) {
        artifact = artifact.replace("https://", "hxxps://");
    }
    return artifact;
}

//Using this as apposed to creating it in the context script because this will allways execute in order as apposed to context script waiting for next thread.
function copyToClipboard(text){
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = 0;
	input.value = text;
	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy');
	document.body.removeChild(input);
};

function sendIt(message){
    
    copyToClipboard(message);
    chrome.tabs.executeScript({code: "document.execCommand('paste');"});
}


/*
 * The click event listener:
 * where we perform the approprate action
 * given the ID of the menu item that was clicked
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // identify context type and strip leading and trailing spaces


    // unsanitize artifact if it is secured against clicking
    //artifact = sanitizeArtifact(artifact);

    // copy the selection to clipboard
    //copyStringToClipboard(artifact);

    switch (info.parentMenuItemId) {
            case "common":
                switch (info.menuItemId) {
                    case "1":
                        sendIt(textables[info.menuItemId-1]);
                        break;
                    case "2":
                        sendIt(textables[info.menuItemId-1]);
                        break;
                    case "3":
                        sendIt(textables[info.menuItemId-1]);
                        break;
                    case "4":
                        sendIt(textables[info.menuItemId-1]);
                        break;
                    case "handled":
                        sendIt("This has been handled in the console. No further action nesscary within this action. ");
                        break;
                    
            } break;
            case "macros":
                switch (info.menuItemId) {
                    case "sanitize":
                        artifact = info.selectionText;
                        artifact = defangURL(artifact);
                        copyToClipboard(artifact);
                        break;
                    case "refang":
                        artifact = info.selectionText;
                        artifact = refangURL(artifact);
                        copyToClipboard(artifact);
                        break;
                    case "encode64":
                        artifact = info.selectionText;
                        artifact = Base64.encode(artifact);
                        copyToClipboard(artifact);
                        break;
                    case "decode64":
                        artifact = info.selectionText;
                        artifact = Base64.decode(artifact);
                        copyToClipboard(artifact);
                        break;
                    }
                    case "decodePPURL":
                        artifact = info.selectionText;
                        //curl https://tap-api-v2.proofpoint.com/v2/url/decode -s -H 'Content-Type: application/json' -d '{"urls":[ ${artifact}]}'
                        var xhttp = new XMLHttpRequest();
                        xhttp.open("POST", "https://tap-api-v2.proofpoint.com/v2/url/decode", true);
                        xhttp.setRequestHeader("Content-type", "application/json");
                        xhttp.send('{"urls": ["https://urldefense.proofpoint.com/v2/url?u=https-3A__go.density.io_api_mailings_click_PMRGSZBCHI2DSNRQGA2SYITVOJWCEORCNB2HI4B2F4XWIZLOONUXI6JONFXSELBCN5ZGOIR2EI3GKYLBMZTGCYJNMMYTIMJNGQ2WMNRNMI2TEMZNGIYTAOBVGQZTOZLDMJRCELBCOZSXE43JN5XCEORCGQRCYITTNFTSEORCJRIHQTBWKZCWKNKBNM2FESCBOB4C2S3HM5RVUZCMKRLDGOLPO5DV6V3DFU3WO6CPPB4UCPJCPU-3D-3D-3D-3D-3D-3D&d=DwMFaQ&c=vtLDwE1j-r1Jx3yyA8ilTg&r=tOtWXObo8XC1ZEaJ0znheIivNUnG_jfdIvrUzG9YGyQ&m=ctP3PeG-ddRIxh5hF5jgS_IhuuCbHxbKt9GdxrgtgoA&s=YACy5QXcL7NpONbSOTYQgey9sJVksDY3JjL4C3LHCOo&e="]}');
                        console.log(xhttp.responseXML)
                        var decURL = JSON.parse(xhttp.responseText);
                        console.log(decURL);
                        //copyToClipboard(xhttp.responseText);
                        break;
                break;
    }
});