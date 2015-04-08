// ON PAGE LOAD ///////////////////////////////////////////////////////////////
$(function () {
    //getRSSItems();
    setRSSPollInterval();
    wireSearchButton();
    wireAddUrlButton();
    wireSubmitUrlButton();
});

function setRSSPollInterval() {
    getRSSItems(/*getLatestStoryTime()*/);
    //setInterval(function () {
    //    getRSSItems(getLatestStoryTime());
    //}, 12000);
}

function getRSSItems(latest, searchParams) {
    if (typeof latest == 'undefined') {
        latest = new Date(0);
    }
    if (typeof searchParams == 'undefined')
    {
        searchParams = '';
    }
    $.ajax({
        beforeSend: function () {
            $.blockUI();
        },
        url: '/Home/GetFeeds',
        error: function (errorObj) {
            alert("error");
        },
        dataType: 'HTML',
        data: {
            lastStory: latest.toJSON(),
            SearchString: searchParams
        },
        success: function (data) {
            insertFeeds(data, searchParams);
            wireCloseButtonHover();
            wireCloseItemHover();
            wireSearchItem();
        },
        type: 'GET',
        complete: function () {
            $.unblockUI();
        }
    });
}

function getLatestStoryTime() {
    var latestStory = $('.divItemContainer').eq(0).find('.dateSpan');
    if (latestStory.length > 0) {
        return (new Date(latestStory.data('date_time')));
    } else {
        return (new Date(0));
    }
}

function showItem(data) {
    data.slideDown('slow');
}

function scaleFeeds() {
    var feedWidth,
        maxFeedHeight = -1,
        feedIter = 1;
    var feedDivs = $('.feedDiv');
    var numFeeds = feedDivs.length;
    if (numFeeds < 4) {
        feedWidth = (100 / numFeeds);
    } else {
        feedWidth = (100 / 4);
    }

    feedDivs.each(function () {
        $curFeed = $(this);
        maxFeedHeight = (maxFeedHeight > $curFeed.height() ? maxFeedHeight : $curFeed.height());
    });

    feedDivs.each(function () {
        var $curFeed = $(this);
        $curFeed.css('width', feedWidth + '%');
        $curFeed.height(maxFeedHeight > 1350 ? 1350 : maxFeedHeight);
        if (feedIter % 4 == 1) {
            $curFeed.css('clear', 'left');
        }
        feedIter++;
    });
}

function appendFeedUrlToConfig(feedUrl) {
    prevNumFeeds = $('.feedDiv').length;
    $.ajax({
        beforeSend: function () {
            //$.blockUI();
        },
        url: '/Home/AddConfigFeed',
        error: function (errorObj) {
            alert("error");
        },
        dataType: 'HTML',
        data: {
            NewFeedUrl: feedUrl
        },
        success: function (data) {
            insertFeeds(data);
            if (prevNumFeeds % 4 == 0)
            {
                feedDivs = $('.feedDiv');
                curFeedHeight = feedDivs.eq(0).css('height');
                feedDivs.css('height', (curFeedHeight / 2) + 'px');
            }
        },
        type: 'POST',
        complete: function () {
            //$.unblockUI();
        }
    });
}

function insertFeeds(data, searchParams) {
    data = $.trim(data);
    searchParams = $.trim(searchParams);
    var container = $('#feedsContainer');
    if (container.is(':empty')) {
        container.html(data);
    } else {
        if (typeof data !== 'undefined' && data !== '') {
            if (typeof searchParams !== 'undefined' && searchParams !== '') {
                container.empty();
                container.html(data);
            } else {
                //var $data = $(data);
                //$data.css('display', 'none');
                //$('.divItemContainer').eq(0).before($data);
                //showItem($data);
                container.html(data);
            }
        }
    }
    scaleFeeds();
    wireInteractions();
}

function insertSearchedFeed(feedDiv, data) {
    feedDiv.replaceWith(data);
}

function rssInputIsValid(input) {
    input = input.trim();
    if (input == null || typeof input == 'undefined' || input == '') {
        return false;
    }
    if (!validateUrl(input)) {
        return false;
    }
    return true;
}

function addUrlError(elem) {
    elem.addClass('inputError');
    elem.val('please enter a valid URL');
    elem.addClass('focusable');
}

function removeErrorClass(elem) {
    elem.removeClass('inputError');
}

function removeAllUrlErrors() {
    $('.txtUrl').each(function () {
        removeErrorClass($(this));
    });
}

function validateUrl(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

function removeAllAddedUrls() {
    $('.liAddUrl').remove();
    $('#spanSubmitUrl').css('display', 'none');
}

function getTopFeedRow() {
    var feeds = $('.feedDiv');
    if (feeds.length > 4) {
        return feeds.slice(0, 4);
    } else {
        return feeds;
    }
}

function increaseTopRowMargin() {
    getTopFeedRow().animate({ 'margin-top': '+=27px' }, 600);
}

function decreaseTopRowMargin() {
    getTopFeedRow().animate({ 'margin-top': '-=27px' }, 600);
}

function searchFeed(searchBox, searchBtn) {
    var searchParam = searchBox.val().trim();
    var feedDiv = searchBox.closest('.feedDiv');
    var url = feedDiv.data('url');
    $.ajax({
        beforeSend: function () {
            $.blockUI();
        },
        url: '/Home/GetFeed',
        error: function (errorObj) {
            alert("error");
        },
        dataType: 'HTML',
        data: {
            FeedUrl: url,
            SearchParam: searchParam
        },
        success: function (data) {
            insertSearchedFeed(feedDiv, data);
            scaleFeeds();
            wireCloseButtonHover();
            wireSearchItem();
        },
        type: 'GET',
        complete: function () {
            $.unblockUI();
        }
    });
    //var feed = searchBox.closest('.feedDiv');
    //var items = feed.children('.itemDiv');
    //var searchRegex = new RegExp(searchParam);
    //var matchedItems = items.filter(function (index) {
    //    return searchRegex.test($(this).html());
    //});
    //items.remove('.itemDiv');
    //searchBox.closest('span').siblings('h1').after(matchedItems);
}

// EVENTS /////////////////////////////////////////////////////////////////////
function wireInteractions() {
    $('.divItemContainer').mouseover(function () {
        var thiss = $(this);
        thiss.find('hr').css('border-top', '3px solid #9A9191');
        thiss.css('background', '#D8E6E8');
    });

    $('.divItemContainer').mouseout(function () {
        var thiss = $(this);
        thiss.find('hr').css('border-top', '1px solid #eee');
        thiss.css('background', 'white');
    });
}

function wireSearchButton() {
    $('#btnSearch').click(function () {
        var searchParam = $('#textSearch').val().trim();
        getRSSItems(getLatestStoryTime(), searchParam);
    });
}

function wireSubmitUrlButton() {
    $('#btnSubmitUrl').click(function () {
        var areValid = true;
        var feeds = new Array();
        $('.txtUrl').each(function () {
            var input = $(this);
            if (rssInputIsValid(input.val())) {
                var url = input.val();
                feeds.push(url);
            } else {
                input.addClass('inputError');
                areValid = false;
                return false;
            }
        });
        if (areValid) {
            $.ajax({
                beforeSend: function () {
                    //$.blockUI();
                },
                url: '/Home/AddConfigFeed',
                error: function (errorObj) {
                    alert("error");
                },
                data: {
                    NewFeedUrls: feeds
                },
                dataType: 'HTML',
                success: function (data) {
                    insertFeeds(data);
                    removeAllAddedUrls();
                },
                type: 'POST',
                complete: function () {
                    //$.unblockUI();
                }
            });
        }
    });
}

function wireAddUrlButton() {
    
    $('#btnAddUrl').click(function () {
        var lastUrlTxtbx = $lastListChild = $('#ulUrl').find('input.txtUrl:last');
        if ((lastUrlTxtbx.length < 1) || rssInputIsValid(lastUrlTxtbx.val())) {
            $.ajax({
                beforeSend: function () {
                    //$.blockUI();
                },
                url: '/Home/GetAddUrlPartialView',
                error: function (errorObj) {
                    alert("error");
                },
                dataType: 'HTML',
                success: function (data) {
                    $lastListChild = $('#ulUrl').children('li:last');
                    $lastListChild.after(data);
                    $newLastListChild = $lastListChild.next();
                    $newLastListChild.css('display', 'none');
                    $newLastListChild.slideDown('slow');
                    $('#spanSubmitUrl').slideDown('slow');
                    $('#spanSubmitUrl').css('display', 'block');
                    var removeButton = $newLastListChild.children('.btnRemoveUrl')
                    wireRemoveUrlButton(removeButton);
                    removeAllUrlErrors();
                    increaseTopRowMargin();
                },
                type: 'GET',
                complete: function () {
                    //$.unblockUI();
                }
            });
        } else {
            addUrlError(lastUrlTxtbx);
            wireFocusable(lastUrlTxtbx);
        }
    });
}

function wireRemoveUrlButton(btn) {
    btn.click(function () {
        $this = $(this);
        var remove = $this.closest('.liAddUrl');
        remove.slideUp('slow', function () {
            remove.remove();
            if ($('.liAddUrl').length < 1) {
                $('#spanSubmitUrl').css('display', 'none');
            }
            decreaseTopRowMargin();
        });
    });
}

function wireFocusable(focusable) {
    focusable.focusin(function () {
        $(this).val('');
    });
}

function wireCloseButtonHover(divElem) {
    if (typeof divElem == 'undefined') {
        $('.spanCloseFeed').hover(function () {
                $(this).find('img').prop('src', '/Content/Images/close-red.png');
            }, function () {
                $(this).find('img').prop('src', '/Content/Images/close.png');
            }
        );
        $('.spanCloseFeed').click(function () {
            $(this).closest('.feedDiv').remove();
            $('.feedDiv').css('clear', 'none');
            scaleFeeds();
        });
    }
}

function wireCloseItemHover(divElem) {
    if (typeof divElem == 'undefined') {
        $('.spanCloseItem').hover(function () {
            $(this).find('img').prop('src', '/Content/Images/close-item-red.png');
        }, function () {
            $(this).find('img').prop('src', '/Content/Images/close-item.png');
        }
        );
        $('.spanCloseItem').click(function () {
            var item = $(this).closest('.itemDiv');
            item.slideUp('slow', function () {
                item.remove();
            });
        });
    }
}

function wireSearchItem() {
    $('.aSearchItem').click(function (e) {
        e.preventDefault();
        var btn = $(this);
        var searchSpan = btn.closest('.spanSearchItem');
        //var item = btn.closest('.feedDiv');
        var searchBox = btn.siblings('.txtSearchItem').first();
        var searchBtn = btn.siblings('img').first();
        searchBox.slideDown(700, function () {
            searchBtn.css('display', 'inline');
            searchBtn.click(function() {
                searchFeed(searchBox, searchBtn);
            });
        });
    });
}

function wireSearchFeedButton() {
    //var searchParam = 
}