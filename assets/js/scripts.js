let url = window.location.href;    
let api_address = "";
let token = "";
if(url == 'file:///C:/Users/milad/OneDrive/Desktop/messenger/index.html'){
  api_address = "http://t.atiehsazan.ir/new_school_prj/backend/api";
  token = "9BE2273C217B5D48453813C7BA0839AF";
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
let chanelData =[];
let allmember = [];
let arrymember = [];
let chanelImage = ``;

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
                  
                  
                  let img = element.image_channel;
                  if (img) {
                   img = `http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${img}`;
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
                console.log(res);
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
  $('.heading-refresh i').css({"visibility":"inherit"});
  $('.reply').css({"visibility":"inherit"})
  let str = e.currentTarget.innerText;
  let endStr = str.search('\n');
  str = str.substr(0, endStr);
  heade_chanel_name = `<a class="heading-name-meta">${str}</a>`;
  $(".heading-name").html(heade_chanel_name);
  $('.heading-avatar-icon img').css({"visibility":"inherit"});
  let img = $(e.currentTarget).children('div.col-sm-3.col-xs-3.sideBar-avatar').children('div.avatar-icon').children('img').attr('src')
  $(".heading-avatar-icon img").attr('src' , img) 
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
        let noCommentText = '';
        let description = '';
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
              description = element.description
              let regexlink = /((((https:\/\/)|(http:\/\/))((\w+)|(\.)|\/|\-|\?|=){0,})(\s)*)/g
              // Replace plain text links by hyperlinks
              description = description.replace(regexlink, "<a href='$1' target='_blank'>$1</a>");
              description = description.replace(/\n/g, '<br/>');
              // Echo link
                
                if (!!(element.list_archive.length)) {
                  let show_file = '';
                    element.list_archive.forEach((element) => {
                        let fileType = element.file_type;
                        if (fileType == 'pdf') {
                          show_file +=`
                          <span class="viwe_box_item">
                          <img class="archive_view_post" src="./assets/images/pdf.png" alt=""></img> 
                          <i id="${element.file__id}" class="fas fa-download"></i>
                          <div class="spinner-border text-secondary" role="status">
                              <span class="sr-only">Loading...</span>
                          </div>
                          </span>`;
                        }else if (fileType == 'aac'|| fileType =='mp3' ){
                          show_file +=`
                          <span class="viwe_box_item" >
                          <img class="archive_view_post" src="./assets/images/player_icon.png" alt=""></img> 
                          <i id="${element.file__id}" class="fas fa-cloud-download-alt audio_play"></i>
                          <div class="spinner-border text-secondary" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </span>`;
                        }else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif'){
                          show_file +=`
                          <span class="viwe_box_item" >
                          <img class="archive_view_post" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt=""></img> 
                          <i id="${element.file__id}" class="fas fa-download"></i>
                          <div class="spinner-border text-secondary" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </span>`;
                        }else{
                          show_file +=`
                          <span class="viwe_box_item" >
                          <img class="archive_view_post" src="./assets/images/document_icon.png" alt=""></img>
                           <i id="${element.file__id}" class="fas fa-download"></i> 
                           <div class="spinner-border text-secondary" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                           </span>`;
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
                                  <div class="message-text">${description}</div>
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
                                  <div class="message-text">${element.description.replace(/\n/g, '<br/>')}</div>
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
    },
    error : function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(ajaxOptions);
      console.log(thrownError);
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
  if(!(session == '') && file__id && (e.target.className == 'fas fa-download' || e.target.className == 'fas fa-cloud-download-alt audio_play')){
    $.ajax({
      url:`http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}`,
      type: "get",
      beforeSend: function(){
        $(`#${file__id}`).css({display : 'none'});
        $(`#${file__id} + .spinner-border`).css({display : 'block'})
      },
      success: function(response) {
        try{
          let res = jQuery.parseJSON(response);
          console.log(res);
          if(res.ResultCode == 4001){
            get_session_archive()
          }
        }catch{
          if(false){
            player(session , file__id);
            
          }else{
            $(`#${file__id}`).css({display : 'block'});
            $(`#${file__id} + .spinner-border`).css({display : 'none'})
            window.open(`http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}`, '_blank');
          }
        }
      },
      error : function (xhr, ajaxOptions, thrownError) {
        // console.log(xhr.status);
        // console.log(ajaxOptions);
        // console.log(thrownError);
      }
    });
  }else if(session == ''){
    get_session_archive()
  }else if(e.target.className == 'fas fa-download'){
    Swal.fire({
      icon: 'error',
      title: 'id فایل یافت نشد',
      showConfirmButton: false,
      timer: 1500
    })
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

  // *** reset textarea css *** 

  if(!$(e.target).parents('#conversation').length && !$(e.target).parents('.reply').length){
    $('#conversation').css({height : ''});
    $('.reply').css({height : '60px'});
    $('.reply-main').css({height : 'auto'});
    $('.reply-main textarea').css({overflow : 'hidden'});
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
          $('textarea.form-control').val('')
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
    let textInsertMessage = $('textarea.form-control').val().trim();
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

// ************************* handle textarea css ****************************
$('.form-control').keyup('',function(){
  let text = $('textarea.form-control').val().split('\n')
  if(text.length > 1){
    $('.reply-main textarea').css({overflow : 'auto'}); 
  }else if(text.length == 1){
    // $('#conversation').css({height : ''});
    // $('.reply').css({height : '60px'});
    // $('.reply-main').css({height : 'auto'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }else if(text.length == 2){
    // $('#conversation').css({height : '81%'});
    // $('.reply').css({height : '70px'});
    // $('.reply-main').css({height : '57px'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }else if(text.length == 3){
    // $('#conversation').css({height : '74%'});
    // $('.reply').css({height : '100px'});
    // $('.reply-main').css({height : '77px'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }else if(text.length == 4){
    // $('#conversation').css({height : '71%'});
    // $('.reply').css({height : '119px'});
    // $('.reply-main').css({height : '100px'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }else if(text.length == 5){
    // $('#conversation').css({height : '67%'});
    // $('.reply').css({height : '144px'});
    // $('.reply-main').css({height : '122px'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }else if(text.length == 6){
    // $('#conversation').css({height : '63%'});
    // $('.reply').css({height : '168px'});
    // $('.reply-main').css({height : '150px'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }else if(text.length > 6){
    // $('.reply-main textarea').css({overflow : 'auto'}); 
  }else{
    // $('#conversation').css({height : ''});
    // $('.reply').css({height : '60px'});
    // $('.reply-main').css({height : 'auto'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }
});

// ************************* delete message ****************************
let deleteMessage  = (channel , news)=>{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    
  })
  
  swalWithBootstrapButtons.fire({
    title: 'پیام حذف شود؟',
    text: "در صورت کلیک روی گزینه بله پیام شما حذف خواهد شد!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'خیر',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
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
      swalWithBootstrapButtons.fire({
          title: 'حذف شد!',
          text: 'پیام شما با موفقیت حذف شد',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        })
      
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
          title: 'لغو شد',
          text: "حذف پیام لغو شد  :)",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        })
    }
  })
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
          // $('.reply_to').css({bottom: '139px'})
          // $('.conversation_comment').css({height: '67%'});
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
      let textInsertMessage = $('textarea.form-control').val().trim();
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
        let text = '';
        comment_list.forEach((element) => {
          text = element.text
              let regexlink = /((((https:\/\/)|(http:\/\/))((\w+)|(\.)|\/|\-|\?|=){0,})(\s)*)/g
              // Replace plain text links by hyperlinks
              text = text.replace(regexlink, "<a href='$1' target='_blank'>$1</a>");
              text = text.replace(/\n/g, '<br/>');
              // Echo link
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
                        <div class="message-text">${text}</div>
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
                        <div class="message-text">${text}</div>
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
  let regexlink = /((((https:\/\/)|(http:\/\/))((\w+)|(\.)|\/|\-|\?|=){0,})(\s)*)/g
  let $temp = $("<input>");
  $("body").append($temp);
  if($(e.target).parents("div.receiver").length){

    $temp.val($(e.target).parents("div.receiver").children("div.message-text").html().replace(/<br\s*[\/]?>/gi,'\r\n').replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }else{

    $temp.val($(e.target).parents("div.sender").children("div.message-text").html().replace(/<br\s*[\/]?>/gi,'\r\n').replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }
  document.execCommand("copy");
  $temp.remove();
  $(e.target).parents("li.more-option-copy").attr("title" , "کپی شد")
  const Toast = Swal.mixin({
    toast: true,
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    title: 'متن شما با موفقیت کپی شد'
  })
});

$('.conversation').on('click','.fa-copy',function(e){
  let regexlink = /((((https:\/\/)|(http:\/\/))((\w+)|(\.)|\/|\-|\?|=){0,})(\s)*)/g
  let $temp = $("<input>");
  $("body").append($temp);
  if($(e.target).parents("div.receiver").length){
    $temp.val($(e.target).parents("div.receiver").children("div.message-text").html().replace(/<br\s*[\/]?>/gi,'\r\n').replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }else{
    $temp.val($(e.target).parents("div.sender").children("div.message-text").html().replace(/<br\s*[\/]?>/gi,'\r\n').replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }
  document.execCommand("copy");
  
  $temp.remove();
  const Toast = Swal.mixin({
    toast: true,
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  Toast.fire({
    title: 'متن شما با موفقیت کپی شد'
  })
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
  let regexlink = /((((https:\/\/)|(http:\/\/))((\w+)|(\.)|\/|\-|\?|=){0,})(\s)*)/g
  let $temp = $("<input>");
  $("body").append($temp);
  if($(e.target).parents("div.receiver").length){

    $temp.val($(e.target).parents("div.receiver").children("div.message-text").html().replace(/<br\s*[\/]?>/gi,'\r\n').replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }else{

    $temp.val($(e.target).parents("div.sender").children("div.message-text").html().replace(/<br\s*[\/]?>/gi,'\r\n').replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }
  document.execCommand("copy");
  $temp.remove();
  $(e.target).parents("li.more-option-copy").attr("title" , "کپی شد")
  const Toast = Swal.mixin({
    toast: true,
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    title: 'متن شما با موفقیت کپی شد'
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

// ************************* delete comment ****************************
let deletecomment = (id) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    
  });
  swalWithBootstrapButtons.fire({
    title: 'پیام حذف شود؟',
    text: "در صورت کلیک روی گزینه بله پیام شما حذف خواهد شد!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'خیر',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
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
      swalWithBootstrapButtons.fire({
        title: 'حذف شد!',
        text: 'پیام شما با موفقیت حذف شد',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
    }else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
          title: 'لغو شد',
          text: "حذف پیام لغو شد  :)",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        })
    }
  })

  
};
// ************************* add_new_channel ****************************
let insert_channel = (chanelData , arrymember)=>{
    let arr_member = JSON.stringify(arrymember)
    let name = ''
    let allow_comment = '';
    let type_channel = '';
  if(arrymember !== [] && chanelData !== []){
    chanelData.forEach(element => {
      name = element.name;
      allow_comment = element.allow_comment;
      type_channel = element.type_channel;
    });
  }
  $.ajax({
    url: api_address + "/notices/insert_channel",
    type: "post",
    data: {
      name : name,
      type_channel : type_channel,
      arr_member : arr_member,
      allow_comment : allow_comment,
      image_channel : chanelImage,

  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          Swal.fire({
            icon: 'success',
            title: 'کانال با موفقیت ثبت شد',
            showConfirmButton: false,
            timer: 3000
          })
          console.log(res);
        }else{
          console.log();
          Swal.fire({
            icon: res.result,
            title: res.data.message,
            showConfirmButton: false,
            timer: 3000
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
}
$('.create_chanel button').on('click',function() {
  let member__id = ''
  let is_admin = 0 ;
  for (let i = 0; i < $('.chanel_list_member').children().length; i++) {
    member__id = $('.chanel_list_member').children()[i].id;
    if($(`#${member__id} .member_admin input`).prop('checked')){
      is_admin = 1
    }else{
      is_admin = 0
    }
    let arrymemberobject = {
        "member__id" : member__id,
        "is_admin" : is_admin
      }
      arrymember.push(arrymemberobject);
  }
  insert_channel(chanelData , arrymember);

});
$(".new-chanel").click(function() {
    $(".add_new_channel").css({ visibility: "inherit" });
    
});
$(".close_add").click(function() {
  chanelData =[];
  allmember = [];
  arrymember = [];
  chanelImage = ``;
  $('#channelName').val('')
  $.each(FileUpload.files, function (file) {
    FileUpload.removeFile(file);
  })
    $(".add_new_channel").css({ visibility: "hidden" });
    $('.step_2').css({ display: "none" });
    $('.step_3').css({ display: "none" });
    $('.step_1').css({ display: "block" });

});
$('.step_1 .next_btn button').on('click', function(){
  let chanelName = $('#channelName').val();
  let allowComment = 0;
  if(!(chanelName == '')){
    FileUpload.start()
    if($('#comment_on').is( ":checked" )){
      allowComment = 1;
    }
    let chanelDataObject = 
    {
      "name": chanelName,
      "type_channel": "channel",
      "allow_comment": allowComment,
    }
    if(chanelData.length == 0){
      chanelData.push(chanelDataObject);
      
    }else if(chanelData.length >= 1){
        chanelData[0] = chanelDataObject
    }
    $('.step_1').css({ display: "none" });
    $('.step_2').css({ display: "block" });
    
  }else{
    $('#channelName').css({ border: "red solid 1px" });
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: 'نام کانال را باید وارد کنید'
    })
  }
});
$('.preve_step_1 button').on('click', function(){
  $('.step_2').css({ display: "none" });
  $('.step_1').css({ display: "block" });
});
$('.step_2 .next_btn button').on('click', function(){
  let cuntmember = false;
  allmember.forEach(element  => {
    if (element.memberlist.length){
      cuntmember = true;
    }
    
  })
  let allowNextStep = false ;
  for (let i = 0; i < $('.badge-pill').length; i++) {
    const element = $('.badge-pill')[i];
    if($(element).html() !== ''){
      allowNextStep = true
    }
  }
  if(allowNextStep && cuntmember){
    $('.step_2').css({ display: "none" });
    $('.step_3').css({ display: "block" });
    sendMemberToNextStep('' , '' , 'next')
  }else{
    $('#channelName').css({ border: "red solid 1px" });
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: 'باید حداقل یک عضو انتخاب کنید'
    })
  }
});
$('.preve_step_2 button').on('click', function(){
  $('.step_3').css({ display: "none" });
  $('.step_2').css({ display: "block" });
});
$("#profile-image1").on("click", function() {
  $("#profile-image-upload").click();
});
let previewFile = () => {
  let preview = document.querySelector("#profile-image1");
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
let FileUpload = new plupload.Uploader({
  browse_button: 'profile-image-upload',
  chunk_size:(200*1024) + 'b',
  max_retries: 3,
  url: 'http://archive.atiehsazan.ir/Api/Upload/index.php',
  multipart_params: {
      chunk_size: 200*1024,
  }
});
FileUpload.init();
FileUpload.bind('FilesAdded', function (up, files) {
  if(!(FileUpload.files.length <= 1)){
    console.log('شما بیش از یک عکس برای ارسال انتخاب نموده اید');
    plupload.each(files, function (file) {
    FileUpload.removeFile(file);
    });
  }
  plupload.each(up.files, function (file) {
    let img = file.type.includes('image');
    if(img){

    }else{
      console.log('پسوند فایل شما معتبر نمی باشد');
    }
  })
    let prevFile ='';
    let uploadFilepeogress
});
FileUpload.bind('UploadProgress',function (up, file) {});
FileUpload.bind('Error', function (up, err) {});
let chaneleImgId = ''
FileUpload.bind('FileUploaded', function (up, file, info) {
  let myresponse = $.parseJSON(info['response']);
  if(1 !== up.files.length){
    up.files.length-1
    FileUpload.removeFile(file);
  }else{
    chaneleImgId = myresponse.Data.File_id
  }
});
FileUpload.bind('ChunkUploaded', function (up, file, info) {});
FileUpload.bind('UploadComplete', function (up, file , info) {
  
  chanelImage = {}
  plupload.each(up.files, function (file) {
     chanelImage = {
      "description":file.name,
      "extera__id":"",
      "file_size":file.size,
      "archive__id":"",
      "file_type":file.type.slice(file.type.indexOf("/")+1,file.type.length),
      "file__id":chaneleImgId,
      "file_name":file.name
     }
     chanelImage = JSON.stringify(chanelImage)
    FileUpload.removeFile(file);
  });
});


// *********** delete member
$('.chanel_list_member').on('click','.member_delete i',function(){
  function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}
  let tagetId = $(this).parents('li').attr('id');

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    
  });
  swalWithBootstrapButtons.fire({
    title: 'آیا کاربر حذف شود؟',
    text: "در صورت کلیک روی گزینه بله کاربر شما از لیست اعضای کانال حذف خواهد شد!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'خیر',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      allmember.forEach((elem , index) => {
        elem.memberlist.forEach((element ,i) => {
          if (tagetId == element.id){
            let result = arrayRemove(allmember[index].memberlist, element);
            allmember[index].memberlist = result
            sendMemberToNextStep('' , '', 'next')
          }
        });
      });
      swalWithBootstrapButtons.fire({
        title: 'حذف شد!',
        text: 'کاربر شما با موفقیت حذف شد',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
    }else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
          title: 'لغو شد',
          text: "حذف کاربر لغو شد  :)",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        })
    }
  })
  
});

// *********** add teacher 

let get_list_teacher = ()=>{
  $.ajax({
    url: api_address + "/users/get_list_teacher",
    type: "post",
    data: {
      status : 'all',
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_teacher = res.data.Rows;
          let out_list_techer = ``
          list_teacher.forEach(element => {
            out_list_techer += 
            `
            <li class="teacher">
              <div class="person_icon">
                  <i class="fas fa-chalkboard-teacher"></i>
              </div>
              <div class="person_name">
                  <h5>${element.name} ${element.family}</h5>
              </div>
              <div class="person_checkbox">
                  <input id="${element.teacher__id}" class="teacher" type="checkbox">
              </div>
            </li>
            `
          });
          $('.person_list').html(out_list_techer)
          enablechecked()
        }else{
          console.log(res);
        }
      }catch(err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
$('.teacher').on('click',function () {
  $('.title_added_person h5').html('انتخاب معلم');
  $('.header_person_box_checkbox input').prop('checked', false);
  get_list_teacher()
  $(".add_btn_person").css({ visibility: "inherit" });
  $(".added_person").css({ visibility: "inherit" });
  $(".person_list").css({ visibility: "inherit" });

});

// *********** add personel
let get_list_personel = ()=>{
  $.ajax({
    url: api_address + "/users/get_list_personel",
    type: "post",
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_personel = res.data.Rows;
          let out_list_personel= ``
          list_personel.forEach(element => {
            out_list_personel += 
            `
            <li class="personel">
              <div class="person_icon">
                  <i class="fas fa-user-tie"></i>
              </div>
              <div class="person_name">
                  <h5>${element.f_name} ${element.l_name}</h5>
              </div>
              <div class="person_checkbox">
                  <input id="${element.personel__id}" class="personel" type="checkbox">
              </div>
            </li>
            `
          });
          $('.person_list').html(out_list_personel)
          enablechecked()
        }else{
          console.log(res);
        }
      }catch(err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
$('.personel').on('click',function () {
  $('.title_added_person h5').html('انتخاب پرسنل');
  $('.header_person_box_checkbox input').prop('checked', false);
  get_list_personel()
  $(".add_btn_person").css({ visibility: "inherit" });
  $(".added_person").css({ visibility: "inherit" });
  $(".person_list").css({ visibility: "inherit" });
});

// *********** add student
let classes_of_branch = ()=>{
  $.ajax({
    url: api_address + "/amoozesh/classes_of_branch",
    type: "post",
    data: {
      branch__id : 'all'
    },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_student = res.data.Rows;
          let out_list_student = ``
          list_student.forEach(element => {
            out_list_student += 
            `
            <li id="${element.class__id}">
              <i class="fas fa-book-open"></i>
              ${element.name_class}
              <span class="badge badge-primary badge-pill">${element.count_student}</span>
              <p id="${element.branch__id}"></p>
              <hr>
            </li>

            `
          });
          $('.classesOfBranch').html(out_list_student)
        }else{
          console.log(res);
        }
      }catch(err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
let list_student_of_class = (classid , branchid)=>{
  $.ajax({
    url: api_address + "/amoozesh/list_student_of_class",
    type: "post",
    data:{
      class__id : classid,
      branch__id : branchid
    },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_student = res.data.Rows;
          let out_list_student= ``
          if(list_student == ""){
            const Toast = Swal.mixin({
              toast: true,
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            
            Toast.fire({
              icon: 'error',
              title: 'ترم تحصیلی انتخابی شما فاقد دانش آموز می باشد'
            })
            return;
          }
          list_student.forEach(element => {
            out_list_student += 
            `
            <li class="student">
              <div class="person_icon">
                  <i class="fas fa-user-graduate"></i>
              </div>
              <div class="person_name">
                  <h5>${element.name} ${element.family}</h5>
              </div>
              <div class="person_checkbox">
                  <input id="${element.student__id}" class="student" type="checkbox">
              </div>
            </li>
            `
          });
          $('.person_list').html(out_list_student);
          enablechecked()
          $(".add_btn_person").css({ visibility: "inherit" });
          $(".added_person").css({ visibility: "inherit" });
          $(".person_list").css({ visibility: "inherit" });
        }else{
          console.log(res);
        }
      }catch(err){
        console.log(err);
      }
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}

$('.student').on('click',function () {
  $(".added_person").css({ visibility: "hidden" });
  $(".person_list").css({ visibility: "hidden" });
  $(".add_btn_person").css({ visibility: "hidden" });
  classes_of_branch()
  
});
$('.classesOfBranch').on('click','li',function () {
  $('.title_added_person h5').html($(this).text());
  $('.header_person_box_checkbox input').prop('checked', false);
  let classid = this.id;
  let branchid = $(this).children('p').attr('id');

  list_student_of_class(classid , branchid)
})

// ***********
$( ".header_person_box_checkbox input" ).change(function() {
    let $input = $( this );
    if($input.is( ":checked" )&&$('.person_list').children().length){
      $('.person_checkbox input').prop('checked', true);
      // $(".add_btn_person").css({ visibility: "inherit" });
    }else{
      $('.person_checkbox input').prop('checked', false);
      // $(".add_btn_person").css({ visibility: "hidden" });
    }
})
$('.person_list').on('change','.person_checkbox input',function() {
  let $input = $( this );
  let inputarry = $('.person_list').children('li').children('div.person_checkbox').children();
  let test = '';
  for (let i = 0; i < inputarry.length; i++) {
    
    test += $(inputarry[i]).prop('checked');
    test = test.replace('false' , ' ')
    if(test == ' '){
      
      // $(".add_btn_person").css({ visibility: "hidden" });
    }else{
    }
    
  }
  if($input.is( ":checked" )){
    // $(".add_btn_person").css({ visibility: "inherit" });
  }else{
    $( ".header_person_box_checkbox input" ).prop('checked', false);
    

  }
});

$('.add_btn_person').on('click',function () {
  let inputarry = $('.person_list').children('li').children('div.person_checkbox').children();
  let memberInfo = [];
  allowsendImfo = true;
  for (let i = 0; i < inputarry.length; i++) {
    if ($(inputarry[i]).prop('checked')) {
     let creatObjectMember =
      {
        "name" : $(inputarry[i]).parents('li').children('div.person_name').children().text(),
        "id" : $(inputarry[i]).attr('id'),
        "termDescription":$('.title_added_person').text(),
      }
      memberInfo.push(creatObjectMember);
    }else{
      allowsendImfo = false;
    }
  }
  if(allowsendImfo){
    if ($('.person_list').children('li').attr('class') == 'teacher') {
      $('li.teacher span').html(memberInfo.length);
      sendMemberToNextStep(memberInfo , 'teacher')
      
    }else if($('.person_list').children('li').attr('class') == 'personel'){
      $('li.personel span').html(memberInfo.length);
      sendMemberToNextStep(memberInfo , 'personel')
    }else if($('.person_list').children('li').attr('class') == 'student'){
      $('li.student span').html(memberInfo.length);
      sendMemberToNextStep(memberInfo , 'student')
    }
    $('.title_added_person h5').html('');
    $('.person_list').html('');
    $('.header_person_box_checkbox input').prop('checked', false);
    $(".added_person").css({ visibility: "hidden" });
    $(".person_list").css({ visibility: "hidden" });
    $(".add_btn_person").css({ visibility: "hidden" });
  }else{
    const Toast = Swal.mixin({
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: 'باید حداقل یک عضو انتخاب کنید'
    })
  }
  


});
let sendMemberToNextStep = (memberlist , posion , btnevent)=>{
  let outMemberlist = ``;
  let allmemberObject = {
    "posion" : posion,
    "memberlist" : memberlist
  }
  
  allmember.forEach((element , i) => {
    if(element.posion == posion){
      if( posion == 'student'){
        allmember[i].memberlist.forEach((element , i)=>{
          if(element.termDescription == $('.title_added_person').text()){
            if(allmemberObject !== ''){
              allmember[i] = allmemberObject;
            }
            allmemberObject = '';
          }
        })
      }else if( posion == 'personel' || posion == 'teacher'){
        if(allmemberObject !== ''){
          allmember[i] = allmemberObject;
        }
        allmemberObject = '';
      }
    }
  });
  if(allmemberObject !== '' && memberlist !== ''){
    allmember.push(allmemberObject)
  }
  if(btnevent == "next"){
    allmember.forEach(element => {
      if(element.posion == 'teacher'){
        element.memberlist.forEach(element =>{
          outMemberlist +=
          `
            <li id="${element.id}">
              <div class="member_icon">
                  <i class="fas fa-chalkboard-teacher"></i>
              </div>
              <div class="member_name">
                  <h5>${element.name}</h5>
              </div>
              <div class="member_delete">
                  <i class="far fa-times-circle"></i>
              </div>
              <div class="member_admin">
                  <input type="checkbox">
              </div>
            </li>
          `
        })

      }else if(element.posion == 'personel'){
        element.memberlist.forEach(element =>{
          outMemberlist +=
          `
            <li id="${element.id}">
              <div class="member_icon">
                  <i class="fas fa-user-tie"></i>
              </div>
              <div class="member_name">
                  <h5>${element.name}</h5>
              </div>
              <div class="member_delete">
                  <i class="far fa-times-circle"></i>
              </div>
              <div class="member_admin">
                  <input type="checkbox">
              </div>
            </li>
          `
        });
      }else if(element.posion == 'student'){
        element.memberlist.forEach(element =>{
          outMemberlist +=
          `
            <li id="${element.id}">
              <div class="member_icon">
                  <i class="fas fa-user-graduate"></i>
              </div>
              <div class="member_name">
                  <h5>${element.name}</h5>
              </div>
              <div class="member_delete">
                  <i class="far fa-times-circle"></i>
              </div>
              <div class="member_admin">
                  <input type="checkbox">
              </div>
            </li>
          `
        });
      }

    });
    $('.chanel_list_member').html(outMemberlist)
  }
}
let enablechecked = () =>{
  allmember.forEach(element  => {
    element.memberlist.forEach(element  => {
      $(`#${element.id}`).prop('checked', true);
    })
  })
  
}


$('.heading-name').on('click' , function () {
  
})

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
      FileUpload.settings.multipart_params["Session_id"] = session;
    }
  })
};

if(session == ''){
  get_session_archive()
}