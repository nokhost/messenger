const api_address = "http://t.atiehsazan.ir/new_school_prj/backend/api";
let token = "7C3CDF0E47CFB4C100B33752BF82F66C";

// ************************* list_channel ****************************
$.ajax({
  url: api_address + "/notices/get_list_channel",
  type: "post",
  beforeSend: function (request) {
    request.setRequestHeader("Authorization", "Bearer " + token);
  },
  success: function (response) {
    $(".sideBar").ready(function () {
      let res = jQuery.parseJSON(response);
      let out = "";
      res.data.list_channel.forEach((element) => {
        let img = "";
        if (img) {
        } else {
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
                    </div>
                    <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                      <span class="time-meta pull-right">18:18
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

// ************************* conversation ****************************
$(".sideBar").on("click", ".sideBar-body", function(){
    let chanel_id = this.id;
      $.ajax({
        url: api_address + "/notices/get_news_channel",
        type: "post",
        data: { 
          start_row: "0",
          number_rows : "10",
          channel__id : chanel_id
        } ,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (response) {
          let res = jQuery.parseJSON(response);
          let myuser_id = res.data.myuser_id;
          let list_news = res.data.list_news;
          let last_row = res.data.detail_rows.last_row;
          let out = '';
          if(last_row == -1){
            out += 
            `
            <div class="row">
              <div class="col-md-12" style="text-align: center;">
                <img class="bg_conversation" src="./assets/images/no_message.png" alt="">
              </div>
            </div>
            `
          }else{
            list_news.forEach((element) => {
            
              if(element.user__id == myuser_id){
                out += 
                `
                <div class="row message-body">
                    <div class="col-sm-12 message-main-receiver">
                      <div class="receiver">
                        <div class="message-text">${element.description}</div>
                        <hr />
                        <a class="comment" href="">
                          <div class="col-xs-12">
                            <i class="far fa-comment-dots"></i>
                            <span class="comment-title">اولین یادداشت را بگذارید</span>
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
              }else{
                out += 
                `
                  <div class="row message-body">
                      <div class="col-sm-12 message-main-sender">
                        <div class="sender">
                          <span class="contact_name">${element.name_family}</span>
                          <div class="message-text">${element.description}</div>
                          <hr />
                          <a class="comment" href="">
                            <div class="col-xs-12">
                              <i class="far fa-comment-dots"></i>
                              <span class="comment-title">اولین یادداشت را بگذارید</span>
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
              $("#conversation").html(out);
            }
          }
          
      
      });
});

$(".heading-refresh").on("click",function(){
})

$(".conversation").on('click','.fa-copy',function () {
  console.log("hi");
});
$(".conversation").on('click','.fa-ellipsis-v',function (e) {
  if(!$('.fa-ellipsis-v').parents('.selected').length){
    $(e.target).parents(".more-option").last().addClass("selected");
  }else{
    $(".selected" ).last().removeClass('selected');
    $(e.target).parents(".more-option").last().addClass("selected");
  }
});
$(window).on('click',function (e) {
  if (!$(e.target).parents('.more-option').length){
    $(".selected" ).last().removeClass('selected')
  }
  
})
// ************************* add_new_channel ****************************
$(".new-chanel").click(function () {
  $(".add_new_channel").css({ visibility: "inherit" });
});
$(".close_add").click(function () {
  $(".add_new_channel").css({ visibility: "hidden" });
  console.log("hi");
});

function previewFile() {
  var preview = document.querySelector("img");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      preview.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}
$(function () {
  $("#profile-image1").on("click", function () {
    $("#profile-image-upload").click();
  });
});
