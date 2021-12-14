let url = window.location.href;    
let api_address = "";
let token = "";
if(url == 'file:///C:/Users/milad/OneDrive/Desktop/messenger/index.html'){
  api_address = "http://t.atiehsazan.ir/new_school_prj/backend/api";
  token = "A507703FA65F7F0E2EDA2E137E8B9E7D";
}else{
  api_address =  "../../backend/api";
  token = localStorage.getItem("token");
}

// ************************* global variables ****************************
let session = '';
let myuser_id = '';
let chanel_id = '';
let preview_file = ``;
let uploadFileShowModal = '';
let errUploadedFile = true;
let listArchive = [];
let primery_id = '';
let commentBox = 'close';
let postId = '';
let count_news_new = 0;



// ************************* list_channel ****************************
let ChanleList = ()=>{
    $.ajax({
        url: api_address + "/notices/get_list_channel",
        type: "post",
        timeout: 50000,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(response) {
          try{
            $(".sideBar").ready(function() {
              let res = jQuery.parseJSON(response);
              let out = "";
              
              if(res.result == 'ok'){
                
                let badge = ``;
                res.data.list_channel.forEach((element) => {
                  count_news_new = element.count_news_new;
                  if (count_news_new >= 1)  {
                    badge = `<span class="count_not_read">${count_news_new}</span>`;
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
              }else{
                Swal.fire({
                  icon: res.result,
                  title: res.data.message,
                  text: 'برای استفاده از پیام رسان مجدد وارد شوید',
                  showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                  }
                }).then(() => {
                  window.close()
                })
              }
              
          });
          }catch(err){
            console.log(err);
          }
           
        },
        error : function (xhr, ajaxOptions, thrownError) {
          console.log(xhr.status);
          console.log(ajaxOptions);
          console.log(thrownError);
        }
    });
}

$('.refresh-chanel i').on('click',function () {
  ChanleList();
});

$(window).on('load',function () {
    ChanleList();
}); 

// ************************* sideBar ****************************
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

// ************************* get_news_channel ****************************
let conversation = '';
let number_rows = 0;
let heade_chanel_name = '';

$(".sideBar").on("click", ".sideBar-body", function(e) {
  $('.reply').css({"visibility":"inherit"})
  let str = e.currentTarget.innerText;
  let endStr = str.search('\n');
  str = str.substr(0, endStr);
  heade_chanel_name = `<a class="heading-name-meta">${str}</a>`;
  chanel_id = this.id;
  let row = 15;
  $('#conversation').on('click','.last_message a',function (e) {
    e.preventDefault();
    if(row <= number_rows){
      row = row + 5;
      get_news_channel( row , chanel_id , 'showMore');
    }else{
      $('.last_message a').hide()
    }
  });
  get_news_channel( row, chanel_id,'clickChanel');
});

let get_news_channel = ( row , id , scrollEndMsg)=>{
  $.ajax({
    url: api_address + "/notices/get_news_channel",
    type: "post",
    data: {
        start_row: "-1",
        number_rows: row,
        channel__id: id
    },
    
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        number_rows =  res.data.detail_rows.last_row
        myuser_id = res.data.myuser_id;
        let list_news = res.data.list_news;
        let last_row = res.data.detail_rows.last_row;
        let out = '';
        let comment = '';
        let archive = '';
        let moreOption = '';
        let contentComment = '';
        let anchorTagComment = '';
        let noCommentText = ''
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
                        let fileType = element.file_type;
                        if (fileType == 'pdf') {
                          show_file +=`<span class="viwe_box_item"><img class="archive_view_post" src="./assets/images/pdf.png" alt=""></img> <i id="${element.file__id}" class="fas fa-download"></i></span>`;
                        }else if (fileType == 'aac'|| fileType =='mp3' ){
                          show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/player_icon.png" alt=""></img> <i id="${element.file__id}" class="fas fa-cloud-download-alt audio_play"></i></span>`;
                        }else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif'){
                          show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt=""></img> <i id="${element.file__id}" class="fas fa-download"></i></span>`;
                        }else{
                          show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/document_icon.png" alt=""></img> <i id="${element.file__id}" class="fas fa-download"></i></span>`;
                        }
                        
                    })
                    archive = `<br> <div class="archive_box"> ${show_file} </div> <br>`
                } else {
                  archive = `<hr/>`
                  if(!!(element.allow_comment == 0) && !!(element.count_comment == 0)){
                    
                    archive = ``;
                  }
                    
                }
                if (!(element.count_comment == 0)) {
                    comment = `${element.count_comment} یادداشت`;
                } else {
                    comment = 'اولین یادداشت را بگذارید';
                }
                if(!!(element.allow_comment == 0) && !!(element.count_comment == 0)){
                  noCommentText = `فعال کردن یادداشت ها`
                }else if(!!(element.allow_comment == 0) &&  !!(element.count_comment > 0)){
                  noCommentText = `فعال کردن یادداشت ها`
                }else{
                  noCommentText = 'غیر فعال کردن یادداشت ها';
                }
                if(element.status == 1){
                  moreOption = `<i class="fas fa-copy" data-bs-toggle="tooltip" data-bs-placement="top" title="برای کپی کردن متن کلیک کنید"></i></i>
                  <i class="fas fa-ellipsis-v"></i>
                  <ul class="more-option-list">
                    <li class="more-option-comments"><i class="far fa-comment"></i><span>یادداشت ها</span></li>
                    <li class="more-option-copy" data-bs-toggle="tooltip" data-bs-placement="top" title="برای کپی کردن متن کلیک کنید"><i class="far fa-copy"></i><span>کپی کردن متن</span></li>
                    <li class="more-option-share"><i class="fas fa-share-alt"></i><span>اشتراک گذاری</span></li>
                    <li class="more-option-recipient"><i class="fas fa-user-friends"></i><span>لیست دریافت کنندگان</span></li>
                    <li class="more-option-nocomment" value="${element.allow_comment}"><i class="fas fa-comment-slash"></i><span>${noCommentText}</span></li>
                    <li class="more-option-delete"><i class="fas fa-trash"></i><span>حذف</span></li>
                  </ul>`;
                  contentComment = `<div class="col-xs-12">
                  <i class="far fa-comment-dots"></i>
                  <span class="comment-title">${comment}</span>
                  <i class="fas fa-angle-left"></i>
                </div>`
                }else{
                  moreOption = ``;
                  contentComment = ``;
                  archive = ``;
                }
                if(!!(element.allow_comment == 0) && !!(element.count_comment == 0)){
                  anchorTagComment = `
                      <a id = ${element.news__id} class="comment" href="">
                            
                       </a>`;
                  
                }else{
                  anchorTagComment = 
                      `<a id = ${element.news__id} class="comment" href="">
                         ${contentComment}
                      </a>
                      `;
                      
                }
                if (element.user__id == myuser_id) {
                    out +=
                        `
                          <div class="row message-body">
                              <div class="col-sm-12 message-main-receiver">
                                <div class="receiver">
                                  <div class="message-text">${element.description}</div>
                                  ${archive}
                                  ${anchorTagComment}
                                  <br>
                                  <span class="message-time pull-right"> ${element.datetime} </span>
                                  <div class="more-option">
                                    ${moreOption}
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
                                  ${anchorTagComment}
                                  <br>
                                  <span class="message-time pull-right"> ${element.datetime} </span>
                                  <div class="more-option">
                                    ${moreOption}
                                  </div>
                                </div>
                              </div>
                          </div>
            `
                }
            });
        }
        out = 
        `<div style="overflow: auto;" class="conversation_body">
            <div class="row last_message"><a href="">نمایش پیام های بیشتر!</a></div>
            ${out}
        </div>`
        $('.conversation_empty').hide();
        $(".heading-name").html(heade_chanel_name);
        $("#conversation .conversation_message").html(out);
        $('.conversation_comment').css({height: "100%"});
        // $('.conversation_message').css({height: "100%"});
        $('.conversation_comment').hide();
        $('.conversation_message').show();
        if(scrollEndMsg == 'showMore'){
          $('#conversation').animate({ scrollTop: 0 }, 1000);
        }else if(scrollEndMsg == 'clickChanel'){
          $('#conversation').animate({ scrollTop: $('.conversation_message')[0].scrollHeight }, 1000);
          ChanleList();
          
        }else{
          $('#conversation')[0].scrollTop =  $('.conversation_body')[0].scrollHeight;
        }
        
        conversation = out;
        commentBox = 'close';
      }catch(err){
        console.log(err);
      }
    }
});
}

// ************************* play audio ****************************
let player =(session ,file__id )=>{
  $('#conversation').on('click','.audio_play',function () {
    $('.play_audio').addClass('run_player');
    let out = '';
        out = `
              <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}" type="audio/mpeg">
        `;
        $('audio').html(out);
  });
}
$('.close_player').on("click",function () {
  $('.play_audio').removeClass('run_player');
});

// ************************* handle click window and conversation ****************************
$(window).on('click', function(e) {
  
  // *** download file ***

  let file__id = e.target.id;
  if(!(session == '') && file__id){
    $.ajax({
      url:`http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}`,
      type: "get",
      success: function(response) {
        try{
          let res = jQuery.parseJSON(response);
          if(res.ResultCode == 4001){
            get_session_archive()
          }
        }catch{
          if(false){
            player(session , file__id);
            
          }else{

            window.open(`http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}`, '_blank');
          }
        }
      }
    });
  }else if(session == ''){
    get_session_archive()
  }

  // *** conversation more option ***

  if (!$(e.target).parents('.more-option').length) {
    $(".selected").last().removeClass('selected');
  }

  // *** close prev list file for upload *** 
 
  if(!$(e.target).parents('.conversation').length &&!$(e.target).parents('.prv_file').length && $(e.target).attr('class') !== 'fas fa-times'){
      $.each(uploader.files, function (i, file) {
        uploader.removeFile(file);
        $(`.msg_upload_lists li`).remove();
        $(`.prv_file span`).remove();
        preview_file = ``;
        uploadFileShowModal = ``;
      });
      if ($('.prv_file').children().length == 0){
        $('.prv_file').css({ visibility: "hidden" });
      }
  }

  // *** clear box msg after click other chanel *** 

  if(!$(e.target).parents('.conversation').length){
    $('textarea.form-control').val('');
  }

  // *** clear box msg after click other chanel *** 

  if(!$(e.target).parents('.conversation').length){
    $('.reply_to').html('');
    $('.reply_to').hide();
    $('.conversation_comment').css({height: 'auto'});
  }
});

// ************************* heading conversation ****************************
$('.heading-back').on('click', function() {
  ChanleList();
    $('.side').show();

});

$(".heading-refresh i").on("click", function() {
  if(commentBox == 'open'){
    get_comment_reply(primery_id)
  }else{

    get_news_channel(15 , chanel_id)
  }
});

// ************************* send message ****************************
let sendMessage  = (id , text , archive)=>{
  $.ajax({
    url: api_address + "/notices/insert_news_channel",
    type: "post",
    data: {
      description : text,
      channel__id : id,
      list_archive : archive,
      allow_comment : 1 ,
      type : 'text',

  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
          let res = jQuery.parseJSON(response);
           
          get_news_channel(15 , chanel_id);
      }catch(err){
        console.log(err);
      }
       
    },
    error : function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(ajaxOptions);
      console.log(thrownError);
    }
  });
 
  
}

$('.reply-send i').on('click', function() {
    let textInsertMessage = $('textarea.form-control').val();
    if(commentBox == 'open'){
      if (!!$('.prv_file').children().length && textInsertMessage !== ''){
        uploader.start();
      }else if(textInsertMessage !== ''){
        if(!!$($('.reply_to')).children().length){
          let h6ClassId = $('.reply_to_content_box h6')[0].outerHTML
          h6ClassId = h6ClassId.slice(h6ClassId.search('"')+1,h6ClassId.length)
          h6ClassId = h6ClassId.slice(0 , h6ClassId.search('"'))
          sendcomment(textInsertMessage , h6ClassId ,listArchive , postId)
          $('.reply_to').html('');
          $('.reply_to').hide();
          $('.conversation_comment').css({height: 'auto'});
        }else{
          sendcomment(textInsertMessage , '',listArchive , postId)
        }
      }else if(!!$('.prv_file').children().length){
        uploader.start();
      }else{
        
        const Toast = Swal.mixin({
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'error',
          title: 'برای ارسال پیام حداقل یک متن  یا یک فایل ارسال کنید'
        })
      }
    }else{
      if (!!$('.prv_file').children().length && textInsertMessage !== ''){
        
        uploader.start();
      }else if(textInsertMessage !== ''){
        sendMessage(chanel_id  , textInsertMessage);
      }else if(!!$('.prv_file').children().length){
         uploader.start();
      }else{
        const Toast = Swal.mixin({
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'error',
          title: 'برای ارسال پیام حداقل یک متن  یا یک فایل ارسال کنید',
          
        })
      }
    }
  
});

// ************************* delete message ****************************
let deleteMessage  = (channel , news)=>{
  $.ajax({
    url: api_address + "/notices/delete_news_channel",
    type: "post",
    data: {
      channel__id : channel,
      news__id : news,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
          let res = jQuery.parseJSON(response);
          if(res.result == 'ok'){
            get_news_channel(15 , chanel_id);
            console.log();
          }else{
          Swal.fire({
            icon: 'error',
            title: res.data.message,
            showConfirmButton: false,
            timer: 2000
          })
          }
      }catch(err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error : function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(ajaxOptions);
      console.log(thrownError);
    }
  });
 
  
}

// ************************* archive files ****************************

let uploader = new plupload.Uploader({
    browse_button: 'pickfiles',
    chunk_size:(200*1024) + 'b',
    max_retries: 3,
    url: 'http://archive.atiehsazan.ir/Api/Upload/index.php',
    multipart_params: {
        chunk_size: 200*1024,
    }
  });
  uploader.init();
  uploader.bind('FilesAdded', function (up, files) {
    let FilesAdded = ()=>{
      plupload.each(files, function (file) {
        let type_file = '';
        let img = file.type.includes('image');
        let pdf = file.type.includes('pdf');
        let voice = file.type.includes('audio');
        let video = file.type.includes('video');
        if(img){
            type_file = ` <img id="" src="./assets/images/img_icon.png" alt="${file.name}">`
          }else if(pdf){
            type_file = ` <img id="" src="./assets/images/pdf.png" alt="${file.name}">`
          }else if(voice){
            type_file = ` <img id="" src="./assets/images/player_icon.png" alt="${file.name}">`
          }else if(video){
            type_file = ` <img id="" src="./assets/images/video_icon.png" alt="${file.name}">`
          }else{
            type_file = ` <img id="" src="./assets/images/document_icon.png" alt="${file.name}">`
          }
          preview_file += `
            <span class="span_prv_archive" id = "${file.id}">
              ${type_file}
              <i class="fas fa-times"></i>
            </span>
        `;
          uploadFileShowModal +=
          `
            <li class="msg_upload_file_box" id = "${file.id}">
              ${type_file}
              <h5 class="fileName">${file.name}</h2>
              <h5 class="fileSize">${plupload.formatSize(file.size)}</h5>
              <h5 class="fileProgress">
                <div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style="--value:0; --size:50px"></div>
              </h5>
              <h5 class="icon"></h5>
              <hr/>
            </li>
          `;
        });
        if(!$($('.prv_file')).children().length){
          $('.reply_to').css({bottom: '139px'})
          $('.conversation_comment').css({height: '67%'});
        }
        $('.prv_file').html(preview_file);
        $('.msg_upload_lists').html(uploadFileShowModal);
        if ($('.prv_file').children().length){
          $('.prv_file').css({ visibility: "inherit"})
          
          
        }
    }
    if(commentBox == 'open') {
      if(uploader.files.length <= 1){
        FilesAdded();
      }else{
        Swal.fire({
          icon: 'error',
          title: 'محدودیت در ارسال تعداد فایل',
          text : 'کاربر گرامی در هر بار بارگزاری فقط می توانید 1 فایل ارسال کنید لطفا مجددا تلاش نمایید!',
          heightAuto : true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
      }
      });
      plupload.each(files, function (file) {
        uploader.removeFile(file);
      });
      
      }
    }else{
      if(uploader.files.length <= 6){
        FilesAdded();
      }else{
          Swal.fire({
            icon: 'error',
            title: 'محدودیت در ارسال تعداد فایل',
            text : 'کاربر گرامی در هر بار بارگزاری فقط می توانید 6 فایل ارسال کنید لطفا مجددا تلاش نمایید!',
            heightAuto : true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
        }
        });
        plupload.each(files, function (file) {
          uploader.removeFile(file);
        });
      }
    }
    $('.prv_file').on('click','.fa-times',function () {
      let clicked_file_id = $(this).parents()[0].id;
      plupload.each(files, function (file) {
        if (file && file.id == clicked_file_id) {
          if ($('.prv_file').children().length == 1){
            $('.prv_file').css({ visibility: "hidden" });
            $('.reply_to').css({bottom: '60px'});
            $('.conversation_comment').css({height: '83%'});
          }
          uploader.removeFile(file);
          $(`.msg_upload_lists li#${clicked_file_id}`).remove();
          $(`#${clicked_file_id}`).remove();
          preview_file = $('.prv_file').html();
          uploadFileShowModal = $('.msg_upload_lists').html();
        }
      });
    });

  });
  uploader.bind('UploadProgress',function (up, file) {
    $('.msg_upload_bg').css({ visibility: "inherit" });
    let progress = 0;
    progress += file.percent ;
    $(`.msg_upload_lists li#${file.id}`).children('h5.fileProgress').children()[0].style.cssText = `--value:${progress}; --size:50px;`
  });
  uploader.bind('Error', function (up, err) {
      // document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
      console.log(err.message);
  });
  uploader.bind('FileUploaded', function (up, file, info) {
        try {
          let myresponse = $.parseJSON(info['response']);
          // console.dir(myresponse);
          ($(`li#${file.id} img`)).attr('id' , myresponse.Data.File_id)
          if (myresponse['Result'] === "Ok") {
            $(`#${file.id} .fileProgress`).hide();
            $(`.msg_upload_lists li#${file.id}`).children('h5.icon').html('<i class="fas fa-check-circle"></i>')
            $('.upload_img_success h4').html(myresponse.Data.Message)
              //console.log(myresponse['Data']['File_id']);
          } else {
            $(`#${file.id} .fileProgress`).hide();
            $(`.msg_upload_lists li#${file.id}`).children('h5.icon').html('<i class="fas fa-exclamation-triangle"></i>')
            $('.upload_img_faile h4').html(myresponse.Data.Message)
            errUploadedFile = false;
              //console.log(myresponse['Data']['Message']);
          }
        } catch (ex) {
            alert(ex);
        }
    });
  uploader.bind('ChunkUploaded', function (up, file, info) {  
  });
  uploader.bind('UploadComplete', function (up, file , info) {
    $('.sending').css({display : 'none'})
    if(errUploadedFile){
      $('.upload_img_success').css({display : 'block'})
      let fileObject = {}
      up.files.forEach(e => {
        fileObject = {
          "description" : "" ,
          "extera__id" : "",
          "file_size" : e.size,
          "archive__id" : "",
          "file_type" : e.type.slice(e.type.indexOf("/")+1,e.type.length),
          "file__id" : ($(`li#${e.id} img`)).attr('id'),
          "file_name" : e.name
        }
        listArchive.push(fileObject);
      });
      listArchive = JSON.stringify(listArchive)
      let textInsertMessage = $('textarea.form-control').val();
      if(commentBox == 'open'){
        if(!!$($('.reply_to')).children().length){
          let h6ClassId = $('.reply_to_content_box h6')[0].outerHTML
          h6ClassId = h6ClassId.slice(h6ClassId.search('"')+1,h6ClassId.length)
          h6ClassId = h6ClassId.slice(0 , h6ClassId.search('"'))
          sendcomment(textInsertMessage , h6ClassId ,listArchive , postId)
          $('.reply_to').html('');
          $('.reply_to').hide();
          $('.conversation_comment').css({height: 'auto'});
        }else{
          sendcomment(textInsertMessage , '',listArchive , postId)
        }
      }else{
        sendMessage(chanel_id , textInsertMessage , listArchive )
      }
    }else{
      $('.upload_img_faile').css({display : 'block'});
      $('.upload_msg_faile').css({display : 'block'});
      setTimeout(function(){
        $('.msg_upload_bg').css({visibility: "hidden"});
        $('.upload_img_faile').css({display : 'none'});
        $('.upload_msg_faile').css({display : 'none'});
        $('.sending').css({display : 'inline-flex'});
      }, 7000);
      setTimeout(function(){
        $.each(uploader.files, function (i, file) {
          uploader.removeFile(file);
          $(`.msg_upload_lists li`).remove();
          $(`.prv_file span`).remove();
          preview_file = ``;
          uploadFileShowModal = ``;
        });
        if ($('.prv_file').children().length == 0){
          $('.prv_file').css({ visibility: "hidden" });
        }
      }, 7000);
      errUploadedFile = true;
    }
  });

// ************************* allow_comment ****************************
let allowComment = (id , allow) => {
  $.ajax({
    url: api_address + "/notices/update_news_channel",
    type: "post",
    data: {
      news__id : id,
      allow_comment : allow
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          get_news_channel(15 , chanel_id);
        }else{
          Swal.fire({
            icon: 'error',
            title: res.data.message,
            showConfirmButton: false,
            timer: 2000
          })

        }
      }catch (err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error: function(response) {
      console.log(response);
    },
  });
};

// ************************* get_comment_reply ****************************
let get_comment_reply = (id) =>{
  $.ajax({
    url: api_address + "/notices/get_comment_reply",
    type: "post",
    data: {
        primery__id: id,

    },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
        let res = jQuery.parseJSON(response);
        let comment_list = res.data.list_comment;
        let msg = '';
        let archive = '';
        let name_family = '';
        let moreOption = '';
        let commentsArry = [];
        let commentObject = {};
        comment_list.forEach((element) => {
          if(element.status == 1){
            moreOption = 
              `<i class="fas fa-reply"></i>
              <i class="far fa-copy"></i>
              <i class="fas fa-trash"></i>`
            name_family = element.name_family
          }else{
            name_family = '';
            moreOption = '';
          }
          let filename = ''
          if(element.list_archive[0]){
            filename = element.list_archive[0].file_name
          }
          commentObject = {
            "description" : element.text ,
            "comment_reply__id" : element.comment_reply__id,
            "fileName" : filename,
          }
          commentsArry.push(commentObject);
          let replyComment = ``;
          if(element.reply_to && element.status == 1){
            
            commentsArry.forEach((elem) =>{
              if(elem.comment_reply__id == element.reply_to){
                if(elem.description){
                  replyComment = `<a class="reply_comment"> <h5>در پاسخ به:</h5><h6 class="${element.reply_to}">${elem.description}</h6> </a> <br>`;
                }else{
                  replyComment = `<a class="reply_comment"> <h5>در پاسخ به:</h5><h6 class="${element.reply_to}">${elem.fileName}</h6> </a> <br>`;
                }
              }
            })
           }else{
             replyComment = '';
             
           }
          if (!!(element.list_archive.length)) {
            let show_file = '';
            
              element.list_archive.forEach((element) => {
                  let fileType = element.file_type;
                  if (fileType == 'pdf') {
                    show_file +=`<div class="archive_view_comment"><img class="archive_view_comment" src="./assets/images/pdf.png" alt="${element.file_name}"></img> <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i></div>`;
                  }else if (fileType == 'aac'|| fileType =='mp3' ){
                    show_file +=` <audio controls>
                    <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" type="audio/ogg">
                    <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" type="audio/mpeg">
                  </audio>`;
                  }else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
                    show_file +=`<div class="archive_view_comment" ><img class="archive_view_comment" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt="${element.file_name}"></img><i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i></div>`;
                  }else{
                    show_file +=`<div class="archive_view_comment" ><img class="archive_view_comment" src="./assets/images/document_icon.png" alt="${element.file_name}"></img> <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i></div>`;
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
                      <div id="${element.comment_reply__id}" class="col-sm-12 message-main-receiver">
                        <div class="receiver">
                        ${replyComment}
                        ${archive}
                        <div class="message-text">${element.text}</div>
                          <span class="message-time pull-right">${element.datetime}</span>
                          <div class="more-option">
                            ${moreOption}
                          </div>
                        </div>
                      </div>
                    </div>
              `

            } else {
                msg +=
                    `
                  <div class="row comment-message-body">
                    <div id="${element.comment_reply__id}" class="col-sm-12 message-main-sender">
                      <div class="sender">
                        <span class="contact_name">${name_family}</span>
                        ${replyComment}
                        ${archive}
                        <div class="message-text">${element.text}</div>
                        <span class="message-time pull-right"> ${element.datetime} </span>
                        <div class="more-option">
                        ${moreOption}
                        </div>
                      </div>
                    </div>
                  </div>
                
                `

            }
            
        });
        let out = conversation;
        out = `
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
        $("#conversation .conversation_comment").html(out);
    }
});
}

$('.conversation').on('click', '.comment', function(e) {
    $('textarea.form-control').val('');
    primery_id = e.currentTarget.id;
    e.preventDefault();
    get_comment_reply(primery_id);
    commentBox = 'open';
    postId = $(e.target).parents()[1].id;
    $('.conversation_comment').show();
    $('.conversation_message').hide();
});

$("#conversation").on('click', '.close-comment-box', function() {
    $('textarea.form-control').val('');
    $('.comment-cadr').hide()
    commentBox = 'close';
    $('.conversation_message').show();
    $('.conversation_comment').hide();
});

// ************************* more option handle ****************************

// open other option ****************************
$(".conversation").on('click', '.fa-ellipsis-v', function(e) {
  if (!$('.fa-ellipsis-v').parents('.selected').length) {
      $(e.target).parents(".more-option").last().addClass("selected");
  } else {
      $(".selected").last().removeClass('selected');
      $(e.target).parents(".more-option").last().addClass("selected");
  }
});
// comment ****************************
$('.conversation').on('click', '.more-option-comments', function(e) {
  primery_id = e.currentTarget.id;
  e.preventDefault();
  get_comment_reply(primery_id);
  commentBox = 'open';
  postId = $(e.target).parents()[1].id;
});

// more-option-copy ****************************
$('.conversation').on('click','.more-option-copy',function(e){
  let $temp = $("<input>");
  $("body").append($temp);
  if($(e.target).parents("div.receiver").length){

    $temp.val($(e.target).parents("div.receiver").children("div.message-text").html()).select();
  }else{

    $temp.val($(e.target).parents("div.sender").children("div.message-text").html()).select();
  }
  document.execCommand("copy");
  $temp.remove();
  $(e.target).parents("li.more-option-copy").attr("title" , "کپی شد")
});
$('.conversation').on('click','.fa-copy',function(e){
  let $temp = $("<input>");
  $("body").append($temp);
  if($(e.target).parents("div.receiver").length){
    $temp.val($(e.target).parents("div.receiver").children("div.message-text").html()).select();
  }else{
    $temp.val($(e.target).parents("div.sender").children("div.message-text").html()).select();
  }
  document.execCommand("copy");
  $temp.remove();
  $(e.target).parents("li.more-option-copy").attr("title" , "کپی شد")
});
// more-option-share ****************************
$('.conversation').on('click','.more-option-share',function(e){
  Swal.fire({
    icon: 'info',
    title: 'این بخش  به زودی اضافه خواهد شد',
    showConfirmButton: false,
    timer: 3000
  })
});

// more-option-recipient ****************************
$('.conversation').on('click','.more-option-recipient',function(e){
  Swal.fire({
    icon: 'info',
    title: 'این بخش  به زودی اضافه خواهد شد',
    showConfirmButton: false,
    timer: 3000
  })
});

// more-option-nocomment ****************************
$('.conversation').on('click','.more-option-nocomment',function(e){
  let allowvalueComment = $(e.target).parents('li.more-option-nocomment')[0].value;
  
  let noCommentId = $(e.target).parents('div.sender').children('a').attr('id');
  if(!noCommentId){
    noCommentId = $(e.target).parents('div.receiver').children('a').attr('id');
   }
   if(allowvalueComment == 1){
    allowvalueComment = allowvalueComment-1;
   }else{
    allowvalueComment = allowvalueComment+1;
   }
   allowComment(noCommentId , allowvalueComment);
  
});

// more-option-delete ****************************
$('.conversation').on('click','.more-option-delete',function(e){
  let commentId = $(e.target).parents('div.sender').children('a').attr('id');
  if(!commentId){
   commentId = $(e.target).parents('div.receiver').children('a').attr('id');
  }
  deleteMessage(chanel_id , commentId);

});

// ************************* more option comment handle ****************************

// more-option-fa-reply ****************************
$('.conversation').on('click','.comment-cadr .fa-reply',function(e){
  let replyeId = $(e.target).parents()[2].id;
  let replyText = $($($(e.target).parents()[2]).children()[0]).children('div.message-text').html();
  if(!replyText){
    let targetFileName = $($($($(e.target).parents()[2]).children()[0]).children('div.archive_box_comment').children()[0]).children('img.archive_view_comment');
    replyText = targetFileName.attr('alt')
  }
  if(!!$($('.prv_file')).children().length){
    $('.reply_to').css({bottom: '139px'})
    $('.conversation_comment').css({height: '67%'});
  }else{
    $('.reply_to').css({bottom: '60px'});
    $('.conversation_comment').css({height: '83%'});
  }
  let outReplyeTo = 
  `<div class="reply_to_content_box">
      <i class="fas fa-times-circle"></i>
      <span>
          <h5>در پاسخ به :</h5>
          <h6 clsss="${replyeId}">${replyText}</h6>
      </span>
  </div>`
  
  $('.reply_to').html(outReplyeTo)
  $('.reply_to').show()
});

$('.reply_to').on('click','i.fa-times-circle',function(){
  $('.reply_to').html('');
  $('.reply_to').hide();
  $('.conversation_comment').css({height: 'auto'});
});

// more-option-fa-copy ****************************
$('.conversation').on('click','.comment-cadr .fa-copy',function(e){
  Swal.fire({
    icon: 'info',
    title: 'این بخش  به زودی اضافه خواهد شد',
    showConfirmButton: false,
    timer: 3000
  })
});

// more-option-fa-trash ****************************
$('.conversation').on('click','.comment-cadr .fa-trash',function(e){
  let commentId = $(e.target).parents()[2].id;
  deletecomment(commentId)
});

// ************************* sendcomment ****************************
let sendcomment = (text , reply_id , archive , extraid)=>{
  $.ajax({
    url: api_address + "/notices/insert_comment_reply",
    type: "post",
    data: {
      text : text,
      reply_to : reply_id,
      list_archive : archive,
      extra__id : extraid,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
          let res = jQuery.parseJSON(response);
          if(res.result == "ok"){
            if(!!$('.prv_file').children().length){
              $('.upload_img_success').css({display : 'block'});
              $('.upload_msg_success').css({display : 'block'});
            
              setTimeout(function(){
                $('.msg_upload_bg').css({visibility: "hidden"});
                $('.upload_img_success').css({display : 'none'});
                $('.upload_msg_success').css({display : 'none'});
                $('.sending').css({display : 'inline-flex'});
              },7000);
              setTimeout(function(){
                $.each(uploader.files, function (i, file) {
                  uploader.removeFile(file);
                  $(`.msg_upload_lists li`).remove();
                  $(`.prv_file span`).remove();
                  preview_file = ``;
                  uploadFileShowModal = ``;
                });
                if ($('.prv_file').children().length == 0){
                  $('.prv_file').css({ visibility: "hidden" });
                }
              }, 7000);
              listArchive = [];
             }
            $('textarea.form-control').val('')
            get_comment_reply(primery_id);
          }else{
            Swal.fire({
              icon: 'error',
              title: res.data.message,
              showConfirmButton: false,
              timer: 2000
            })
          }
           
      }catch(err){
        console.log(err);
      }
       
    },
    error : function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(ajaxOptions);
      console.log(thrownError);
    }
  });
};

// ************************* deletecomment ****************************
let deletecomment = (id) => {
  $.ajax({
    url: api_address + "/notices/delete_comment_reply",
    type: "post",
    data: {
      comment_reply__id : id,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          get_comment_reply(primery_id)
        }else{
          console.log(res);

        }
      }catch (err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error: function(response) {
      console.log(response);
    },
  });
};
// ************************* add_new_channel ****************************
$(".new-chanel").click(function() {
    // $(".add_new_channel").css({ visibility: "inherit" });
    Swal.fire({
      icon: 'info',
      title: 'این بخش  به زودی اضافه خواهد شد',
      showConfirmButton: false,
      timer: 3000
    })
});

$(".close_add").click(function() {
    $(".add_new_channel").css({ visibility: "hidden" });
});

function previewFile() {
    let preview = document.querySelector("img");
    let file = document.querySelector("input[type=file]").files[0];
    let reader = new FileReader();

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

// ************************* get_session_archive  ****************************

let get_session_archive = () =>{
  $.ajax({
    url: api_address + "/general/get_session_archive",
    type: "post",
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      let res = jQuery.parseJSON(response);
      session = res.data.session
      uploader.settings.multipart_params["Session_id"] = session;
    }
  })
};

if(session == ''){
  get_session_archive()
}