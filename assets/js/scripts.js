const api_address = "http://t.atiehsazan.ir/new_school_prj/backend/api";
let token = "7C3CDF0E47CFB4C100B33752BF82F66C";

// ************************* list_channel ****************************
let refreshChanleList = ()=>{
    $.ajax({
        url: api_address + "/notices/get_list_channel",
        type: "post",
        timeout: 50000,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(response) {
            $(".sideBar").ready(function() {
                let res = jQuery.parseJSON(response);
                let out = "";
                res.data.list_channel.forEach((element) => {
                    let badge = ``;
                    if (element.count_news_new == 1) {
                        badge = `<span class="count_not_read">${element.count_news_new}</span>`;
                    } else {
                        badge = '';
                    }
                    let img = "";
                    if (img) {} else {
                        img = [
                            "./assets/images/blue.png",
                            "./assets/images/green.png",
                            "./assets/images/pink.png",
                            "./assets/images/yellow.png",
                        ];
                        img = img[Math.floor(Math.random() * img.length)];
                    }
                    out += `
                <div id= '${element.channel__id}' class='row sideBar-body'>
                  <div class="col-sm-3 col-xs-3 sideBar-avatar">
                      <div class="avatar-icon">
                        <img src= ${img}>
                      </div>
                    </div>
                    <div class="col-sm-9 col-xs-9 sideBar-main">
                      <div class="row">
                        <div class="col-sm-8 col-xs-8 sideBar-name">
                          <span class="name-meta">${element.channel_name}
                        </span>
                        <br>
                        <span style="font-size: 10px; color: #838080;">${element.last_news}</span>
                        </div>
                        <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                          <span class="time-meta pull-right">
                            ${badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                });
                $(".sideBar").html(out);
            });
        },
    });
}

$('.heading-refresh i').on('click',function () {
    refreshChanleList();
});
$(window).on('load',function () {
  refreshChanleList();
})

// ************************* sidebar ****************************
let myuser_id = '';
let conversation = '';
let chanel_id = '';

$(".sideBar").on("click", ".sideBar-body", function(e) {
    let str = e.currentTarget.innerText;
    let endStr = str.search('\n');
    str = str.substr(0, endStr);
    let heade_chanel_name = `<a class="heading-name-meta">${str}</a>`;
    chanel_id = this.id;
    $.ajax({
        url: api_address + "/notices/get_news_channel",
        type: "post",
        data: {
            start_row: "-1",
            number_rows: "5",
            channel__id: chanel_id
        },
        
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(response) {
            let res = jQuery.parseJSON(response);
            myuser_id = res.data.myuser_id;
            let list_news = res.data.list_news;
            let last_row = res.data.detail_rows.last_row;
            let out = '';
            let comment = '';
            let archive = '';
            

            if (last_row == -1) {
                out = `
                <div class="row">
                  <div class="col-md-12" style="text-align: center;">
                    <br>
                    <br>
                    <h5>هیچ پیامی یافت نشد! </h5>
                    <img class="bg_conversation" src="./assets/images/no_message.png" alt="">
                  </div>
                </div>
              `;
            } else {
                list_news.forEach((element) => {
                  
                    if (!!(element.list_archive.length)) {
                      let show_file = '';
                        element.list_archive.forEach((element) => {
                          console.log(element);
                            let fileType = element.file_type;
                            if (fileType == 'pdf') {
                              show_file +=`<span class="viwe_box_item"><img class="archive_view_post" src="./assets/images/pdf.png" alt=""></img> <i class="fas fa-download"></i></span>`;
                            }else if (fileType == 'aac'|| fileType =='mp3' ){
                              show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/player_icon.png" alt=""></img> <i class="fas fa-cloud-download-alt"></i></span>`;
                            }else if (fileType == 'jpg' || fileType == 'jpeg'){
                              show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/img_icon.png" alt=""></img> <i class="fas fa-download"></i></span>`;
                            }else{
                              show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/document_icon.png" alt=""></img> <i class="fas fa-download"></i></span>`;
                            }

                        })
                        archive = `<br> <div class="archive_box"> ${show_file} </div> <br>`
                    } else {
                        archive = `<hr/>`
                    }
                    if (!(element.count_comment == 0)) {
                        comment = `${element.count_comment} یادداشت`;
                    } else {
                        comment = 'اولین یادداشت را بگذارید';
                    }
                    if (element.user__id == myuser_id) {
                        out +=
                            `
                              <div class="row message-body">
                                  <div class="col-sm-12 message-main-receiver">
                                    <div class="receiver">
                                      <div class="message-text">${element.description}</div>
                                      ${archive}
                                      <a id = ${element.news__id} class="comment" href="">
                                        <div class="col-xs-12">
                                          <i class="far fa-comment-dots"></i>
                                          <span class="comment-title">${comment}</span>
                                          <i class="fas fa-angle-left"></i>
                                        </div>
                                      </a>
                                      <br>
                                      <span class="message-time pull-right"> ${element.datetime} </span>
                                      <div class="more-option">
                                        <i class="fas fa-copy"></i>
                                        <i class="fas fa-ellipsis-v"></i>
                                        <ul class="more-option-list">
                                          <li class="more-option-comments"><i class="far fa-comment"></i><span>یادداشت ها</span></li>
                                          <li class="more-option-copy"><i class="far fa-copy"></i><span>کپی کردن متن</span></li>
                                          <li class="more-option-share"><i class="fas fa-share-alt"></i><span>اشتراک گذاری</span></li>
                                          <li class="more-option-recipient"><i class="fas fa-user-friends"></i><span>لیست دریافت کنندگان</span></li>
                                          <li class="more-option-nocomment"><i class="fas fa-comment-slash"></i><span>غیر فعال کردن یادداشت ها</span></li>
                                          <li class="more-option-delete"><i class="fas fa-trash"></i><span>حذف</span></li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                `
                    } else {
                        out +=
                            `
                              <div class="row message-body">
                                  <div class="col-sm-12 message-main-sender">
                                    <div class="sender">
                                      <span class="contact_name">${element.name_family}</span>
                                      <div class="message-text">${element.description}</div>
                                      ${archive}
                                      <a id = ${element.news__id} class="comment" href="">
                                        <div class="col-xs-12">
                                          <i class="far fa-comment-dots"></i>
                                          <span class="comment-title">${comment}</span>
                                          <i class="fas fa-angle-left"></i>
                                        </div>
                                      </a>
                                      <br>
                                      <span class="message-time pull-right"> ${element.datetime} </span>
                                      <div class="more-option">
                                        <i class="fas fa-copy"></i>
                                        <i class="fas fa-ellipsis-v"></i>
                                        <ul class="more-option-list">
                                          <li class="more-option-comments"><i class="far fa-comment"></i><span>یادداشت ها</span></li>
                                          <li class="more-option-copy"><i class="far fa-copy"></i><span>کپی کردن متن</span></li>
                                          <li class="more-option-share"><i class="fas fa-share-alt"></i><span>اشتراک گذاری</span></li>
                                          <li class="more-option-recipient"><i class="fas fa-user-friends"></i><span>لیست دریافت کنندگان</span></li>
                                          <li class="more-option-nocomment"><i class="fas fa-comment-slash"></i><span>غیر فعال کردن یادداشت ها</span></li>
                                          <li class="more-option-delete"><i class="fas fa-trash"></i><span>حذف</span></li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                `
                    }
                });
            }
            out = 
            `<div style="overflow: auto;">
                <div class="row last_message"><a href="">نمایش پیام های بیشتر!</a></div>
                ${out}
            </div>`
            $(".heading-name").html(heade_chanel_name);
            $("#conversation").html(out);
            conversation = out;
        }


    });
});

$('.sideBar').on('click', function() {
    if (parseInt($(window).width()) < 768) {
        $('.side').hide();
    }
});

$(window).resize(function() {
    if (parseInt($(window).width()) > 768) {
        $('.side').show();
    }

});


// ************************* conversation ****************************
$('.heading-back').on('click', function() {
    $('.side').show();
});

$(".heading-refresh").on("click", function() {
    console.log('heading-refresh');
});

$(".conversation").on('click', '.fa-copy', function() {
    console.log("hi");
});

$(".conversation").on('click', '.fa-ellipsis-v', function(e) {
    if (!$('.fa-ellipsis-v').parents('.selected').length) {
        $(e.target).parents(".more-option").last().addClass("selected");
    } else {
        $(".selected").last().removeClass('selected');
        $(e.target).parents(".more-option").last().addClass("selected");
    }
});

$(window).on('click', function(e) {
    if (!$(e.target).parents('.more-option').length) {
        $(".selected").last().removeClass('selected');
    }

});

// ************************* send message ****************************
$('.reply-send i').on('click', function() {

    if (chanel_id) {
        $.ajax({
            url: api_address + "/notices/insert_news_channel",
            type: "post",
            data: {
                description: '',
                channel__id: chanel_id,
                list_archive: '',
                allow_comment: '',
                type: 'text'
            },
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: function(response) {
                $(".sideBar").ready(function() {
                    let res = jQuery.parseJSON(response);
                    console.log(res);
                    let out = "";


                });
            },
        });
    } else {}
})

// ************************* comment ****************************
$('.conversation').on('click', '.comment', function(e) {
    let primery__id = e.currentTarget.id;
    e.preventDefault();
    $.ajax({
        url: api_address + "/notices/get_comment_reply",
        type: "post",
        data: {
            primery__id: primery__id,

        },
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(response) {
            let res = jQuery.parseJSON(response);
            let comment_list = res.data.list_comment;
            let msg = '';
            let archive = '';

            comment_list.forEach((element) => {
              if (!!(element.list_archive.length)) {
                let show_file = '';
                  element.list_archive.forEach((element) => {
                    console.log(element);
                      let fileType = element.file_type;
                      if (fileType == 'pdf') {
                        show_file +=`<img class="archive_view_comment" src="./assets/images/pdf.png" alt=""></img>`;
                      }else if (fileType == 'aac'|| fileType =='mp3' ){
                        show_file +=`<img class="archive_view_comment" src="./assets/images/player_icon.png" alt=""></img>`;
                      }else if (fileType == 'jpg' || fileType == 'jpeg'){
                        show_file +=`<img class="archive_view_comment" src="./assets/images/img_icon.png" alt=""></img>`;
                      }else{
                        show_file +=`<img class="archive_view_comment" src="./assets/images/document_icon.png" alt=""></img>`;
                      }

                  })
                  archive = `<br> <div class="archive_box_comment"> ${show_file} </div> <br>`
              } else {
                  archive = ``
              }
                if (myuser_id == element.user__id) {
                    msg +=
                        `
                        <div class="row comment-message-body">
                          <div class="col-sm-12 message-main-receiver">
                            <div class="receiver">
                            ${archive}
                            <div class="message-text">${element.text}</div>
                              <span class="message-time pull-right">${element.datetime}</span>
                              <div class="more-option">
                                <i class="fas fa-reply"></i>
                                <i class="far fa-copy"></i>
                                <i class="fas fa-trash"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                  `

                } else {
                    msg +=
                        `
                      <div class="row comment-message-body">
                        <div class="col-sm-12 message-main-sender">
                          <div class="sender">
                            <span class="contact_name">${element.name_family}</span>
                            ${archive}
                            <div class="message-text">${element.text}</div>
                            <span class="message-time pull-right"> ${element.datetime} </span>
                            <div class="more-option">
                              <i class="fas fa-reply"></i>
                              <i class="far fa-copy"></i>
                              <i class="fas fa-trash"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                    `

                }
            });
            let out = conversation;
            out += `
                  <div class="row comment-cadr">
                    <div class="col-md-12 comment-box">
                      <div class="row close-comment-box">
                        <div class="col-sm-1 col-xs-1 close_add pull-right">
                          <i class="fas fa-times pull-right" aria-hidden="true"></i>
                        </div>
                      </div>
                        ${msg}
                    </div>
                  </div>
            `;
            $("#conversation").html(out);
        }
    });
});

$("#conversation").on('click', '.close-comment-box', function() {
    $('.comment-cadr').hide()
});

// ************************* add_new_channel ****************************
$(".new-chanel").click(function() {
    $(".add_new_channel").css({ visibility: "inherit" });
});

$(".close_add").click(function() {
    $(".add_new_channel").css({ visibility: "hidden" });
});

function previewFile() {
    var preview = document.querySelector("img");
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    reader.addEventListener(
        "load",
        function() {
            preview.src = reader.result;
        },
        false
    );

    if (file) {
        reader.readAsDataURL(file);
    }
};

$(function() {
    $("#profile-image1").on("click", function() {
        $("#profile-image-upload").click();
    });
});