console.log(
    "\n %c MemosGallery v1.0.1 %c https://i.yct.ee/ \n",
    "color: #fadfa3; background: #030307; padding:5px 0;",
    "background: #fadfa3; padding:5px 0;"
);
photos();

//查询所有用户api “https://memos.smitten.top/api/v1/memo/all?tag=相册”
function photos() {
    fetch("https://memos-zyx.zeabur.app/api/v1/memo?creatorId=1&tag=相册")
        .then((res) => res.json())
        .then((data) => {
            // 记得修改memos地址
            let html = "",
                imgs = [];
            data.forEach((item) => {
                imgs = imgs.concat(item.content.match(/\!\[.*?\]\(.*?\)/g)).concat(procMemosResources('https://memos-zyx.zeabur.app/', item));
            });
            imgs.forEach((item) => {
                if (item) {
                    let img = item.replace(/!\[.*?\]\((.*?)\)/g, "$1"),
                        time,
                        title,
                        tat = item.replace(/!\[(.*?)\]\(.*?\)/g, "$1");
                    if (tat.indexOf(" ") != -1) {
                        time = tat.split(" ")[0];
                        title = tat.split(" ")[1];
                    } else title = tat;

                    html += `<div class="gallery-photo"><a href="${img}" data-fancybox="gallery" class="fancybox" data-thumb="${img}"><img class="photo-img" loading='lazy' decoding="async" data-lazyload="${img}" src="public/load.svg"></a>`;
                    title ? (html += `<span class="photo-title">${title}</span>`) : "";
                    time ? (html += `<span class="photo-time">${time}</span>`) : "";
                    html += `</div>`;
                }
            });

            document.querySelector(".gallery-photos.page").innerHTML = html;
            window.Lately && Lately.init({target: ".photo-time"});
        })
        .catch();

    $(window).scroll(function () {
        $(".photo-img:visible").each(function () {
            var img = $(this);
            if (img.offset().top < $(window).scrollTop() + $(window).height()) {
                img.attr("src", img.attr("data-lazyload"));
            }
        });
        $(".bg").remove();
        $(".text").remove();
    });
}

/**
 * 解析resources
 * @param memosUrl url
 * @param item memos data
 * @returns {string|RegExpMatchArray}
 */
function procMemosResources(memosUrl, item) {
    if (!(item && item.resourceList && 0 < item.resourceList.length) || !memosUrl) {
        return '';
    }
    let content = item.content;
    //取最后一个空格后的值为标题
    let titleConts = content.replace("\n", '').split(' ');
    let title = titleConts[titleConts.length - 1];
    let resourceList = item.resourceList;
    let picsUrlLikeMd = '';
    for (var j = 0; j < resourceList.length; j++) {
        var restype = resourceList[j].type.slice(0, 5);
        var resexlink = resourceList[j].externalLink
        var resLink = '', fileId = '';
        var createdDate = new Date(resourceList[j].createdTs * 1000);
        var dt = [createdDate.getFullYear(), createdDate.getMonth() + 1, createdDate.getDate()].join('-');
        if (resexlink) {
            resLink = resexlink
        } else {
            fileId = resourceList[j].publicId || resourceList[j].filename
            resLink = memosUrl + 'o/r/' + resourceList[j].id + '/' + fileId
        }
        if (restype === 'image') {
            if (!title) {
                picsUrlLikeMd += `![${dt}](${resLink})`;
            } else {
                picsUrlLikeMd += `![${dt} ${title}](${resLink})`;
            }
        }
    }
    return picsUrlLikeMd.match(/\!\[.*?\]\(.*?\)/g);
}

$(document).ready(function () {
    $(".arrow").click(function () {
        $(".bg").remove();
        $(".text").remove();
        $(window).scroll();
    })
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 1000) {
            $("#back-to-top").fadeIn();
        } else {
            $("#back-to-top").fadeOut();
        }
    });

    $("#back-to-top").click(function () {
        $("html, body").animate({scrollTop: 0}, 800);
        return false;
    });
});
