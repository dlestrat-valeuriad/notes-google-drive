
var background = chrome.extension.getBackgroundPage();


document.addEventListener('DOMContentLoaded', function()
{
    $('#sign-out-button').click( function()
    {
        background.gdrive.oauth.clearAccessToken();
        background.gdrive.revokeAuthToken( updateDisplay );
    });

    $('#open-folder-button').click( function()
    {
        chrome.tabs.create({ url: background.cache.folder.alternateLink });
    });

    $('#reload-cache-button').click( function()
    {
        invalidateCache();
        background.updateCache();
    });

    $('#space-paragraphs-check').click( function()
    {
        savePrefs();
    });

    $('#reload-cache-button').tooltip();

    window.setTimeout(function()
    {
        updateDisplay();
    }, 1);
});


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse)
{
    if(request.authenticationSucceeded)
    {
        updateDisplay();
    }
});


function updateDisplay()
{
    // preferences content
    loadPrefs();

    // account related content
    var hasAccessToken = background.gdrive.oauth.hasAccessToken();

    $('#sign-out-button').prop('disabled', !hasAccessToken);
    $('#open-folder-button').prop('disabled', !background.cache.folder);

    if(hasAccessToken)
    {
        background.gdrive.about( function(response)
        {
            var $description = $('#signed-in-as');

            $description.text('You are signed in as ' + response.user.emailAddress);
            $description.fadeIn();
        })
    }
    else
    {
        $('#signed-in-as').hide();
    }
}


function invalidateCache()
{
    background.cache =
    {
      folder: null,
      documents: []
    }
}


function loadPrefs()
{
    chrome.storage.sync.get('space-paragraphs-pref', function(result)
    {
        var spaceParagraphs = result[ 'space-paragraphs-pref' ];
        $('#space-paragraphs-check').prop('checked', spaceParagraphs == 1);
    });
}

function savePrefs()
{
    var spaceParagraphs_checked = $('#space-paragraphs-check').is(":checked");
    chrome.storage.sync.set({'space-paragraphs-pref': spaceParagraphs_checked});
}
