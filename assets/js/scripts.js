let url = window.location.href;    
let api_address = "";
let token = "";
if(url == 'file:///C:/Users/milad/OneDrive/Desktop/messenger/index.html' || url == 'file:///C:/Users/milad/OneDrive/Desktop/new%20message/messenger/index.html' || url =='file:///C:/Users/GIGABYTE/Desktop/messenger/index.html' || url == 'file:///C:/Users/darvi/Desktop/messenger/index.html'){
  api_address = "http://t.atiehsazan.ir/new_school_prj/backend/api";
  token = "0D1B0DBA0A84F13255C9AC66887064F4";
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
let comment_id = '';
let commentBox = 'close';
let postId = '';
let count_news_new = 0;
let chanelData =[];
let allmember = [];
let arrymember = [];
let chanelImage = ``;
let listChanel = ``;
let addmembers = ``;
let upadtememberchanel = [];
let sendData = 'send'
let techerlist = ''
let personelList = ''
let studentList = ''
let memberInfo = [];
let timerint = {};
let headePost = ``;
let chaneleImgId = ''
let cuntNotReadNews = 0;
let lastRow = 0
let archbox = 0;
let allow_comment_update = '';
let stepLoationUpdate = ''

// ************************* refresh listChanel and Conve ****************************
let refresListChanel =  setInterval (() =>{
  ChanleList();
},30000);
// ************************* exit-mesengher ****************************
$('.exit-mesengher').on('click',function (){
  window.close()
});

// ************************* list_channel ****************************
let ChanleList = ()=>{
    $.ajax({
        url: api_address + "/notices/get_list_channel",
        type: "post",
        timeout: 50000,
        beforeSend: function(request) {
            $('.loader').show();
            request.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(response) {
          try{
           
              let res = jQuery.parseJSON(response);
              let out = "";
              if(res.result == 'ok'){
                $('.loader').hide();
                listChanel = res.data;
                let badge = ``;
                res.data.list_channel.forEach((element) => {
                  let channel_name = element.channel_name
                  if (channel_name.length > 15){
                    channel_name = element.channel_name.substr(0,15) + '...';
                  }
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
                    <div id= '${element.channel__id}' class='row sideBar-body' allow_comment = ${element.allow_comment}>
                      <div class="col-sm-3 col-xs-3 sideBar-avatar">
                          <div class="avatar-icon">
                            <img src= ${img}>
                          </div>
                        </div>
                        <div class="col-sm-9 col-xs-9 sideBar-main">
                          <div class="row">
                            <div class="col-sm-8 col-xs-8 sideBar-name">
                              <span class="name-meta">${channel_name}
                            </span>
                            <span class="full_channel_name">${element.channel_name}
                            </span>
                            <br>
                            <span style="font-size: 10px; color: #cfcfcf;">${element.last_news}</span>
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
  if (parseInt($(window).width()) < 992) {
      $('.side').hide();
      $('.conversation').show();
  }
});

$(window).resize(function() {
  if (parseInt($(window).width()) > 992) {
      $('.side').show();
  }

});

// ************************* searchText ****************************
$(`#searchText`).keyup(function(){
  let input, filter, sideBar, sideBar_body, full_channel_name, i, txtValue;
  input = $("#searchText");
  filter = input.val();
  sideBar = $(".sideBar");
  sideBar_body = $(".sideBar-body");
  for (i = 0; i < sideBar_body.length; i++) {
      full_channel_name = $(sideBar_body[i]).children('div.col-sm-9.col-xs-9.sideBar-main').children('div.row').children('div.col-sm-8.col-xs-8.sideBar-name').children('span.full_channel_name')[0];
      txtValue = full_channel_name.textContent || full_channel_name.innerText;
      if (txtValue.indexOf(filter) > -1) {
          sideBar_body[i].style.display = "";
      } else {
          sideBar_body[i].style.display = "none";
      }
  }
});
// ************************* get_news_channel ****************************
let conversation = '';
let number_rows = 0;
let heade_chanel_name = '';
let row = 15;

$(".sideBar").on("click", ".sideBar-body", function(e) {
  allow_comment_update = $(this).attr('allow_comment')
  row = 15
  $('.heading-refresh i').css({"visibility":"inherit"});
  $('.reply').css({"visibility":"inherit"})
  let str = e.currentTarget.innerText;
  let endStr = str.search('\n');
  str = str.substr(0, endStr);
  str = $(e.currentTarget).children('div.col-sm-9.col-xs-9.sideBar-main').children('div.row').children('div.col-sm-8.col-xs-8.sideBar-name').children('span.full_channel_name')[0].innerText;
  heade_chanel_name = `<a class="heading-name-meta">${str}</a>`;
  $(".heading-name").html(heade_chanel_name);
  $(".chanel-name").html(heade_chanel_name);
  $('.heading-avatar-icon img').css({"visibility":"inherit"});
  let img = $(e.currentTarget).children('div.col-sm-3.col-xs-3.sideBar-avatar').children('div.avatar-icon').children('img').attr('src')
  $(".heading-avatar-icon img").attr('src' , img)
  $(".info-img img").attr('src' , img)
  chanel_id = this.id;
  $("#searchText").val("")
  get_news_channel( row, chanel_id,'clickChanel');
  if(allow_comment_update === '0'){
    $('#update_comment_on').prop('checked' , false);
  }else if(allow_comment_update === '1'){
    $('#update_comment_on').prop('checked' , true);
  }
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
      $('.moreMessage').show();
      $('.lastMoreMessage').show();
      request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        $('.moreMessage').hide();
        $('.lastMoreMessage').hide();
        if (res.result == 'ok'){
          number_rows =  res.data.detail_rows.last_row;
          lastRow = number_rows
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
          let enabelcomment = ``;
          let notReadMsg = [];
          if (last_row == -1) {
              out = `
              <div class="row" style="height: auto;">
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
                if (element.seen_date == '') {
                  notReadMsg.push(element.news__id)
                }
                
                description = element.description
                let regexlink = /((((https:\/\/)|(http:\/\/))((\w+)|(\.)|\/|\-|\?|=){0,})(\s)*)/g
                // Replace plain text links by hyperlinks
                description = description.replace(regexlink, "<a href='$1' target='_blank'>$1</a>");
                description = description.replace(/\n/g, '<br/>');
                // Echo link
                let regx =/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
                let emoji = description.replace(regx, match => `[e-${match.codePointAt(0).toString(16)}]`);
                  
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
                          }else if (fileType == 'mpeg' || fileType == 'aac' || fileType =='mp3' ){
                            show_file +=`
                            <span class="viwe_box_item" >
                            <img class="archive_view_post" src="./assets/images/player_icon.png" alt=""></img> 
                            <i id="${element.file__id}" class="fas fa-cloud-download-alt audio_play" type = ${fileType}></i>
                            <div class="spinner-border text-secondary" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>`;
                          }else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif' ){
                            show_file +=`
                            <span class="viwe_box_item" >
                            <img class="archive_view_post" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt=""></img> 
                            <i id="${element.file__id}" class="fas fa-download"></i>
                            <div class="spinner-border text-secondary" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </span>`;
                          }else if ( fileType == 'mp4'){
                            show_file +=`
                            <span class="viwe_box_item" >
                            <img class="archive_view_post" src="./assets/images/video_icon.png" alt=""></img> 
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
                    noCommentText = `فعال کردن یادداشت ها`;
                    enabelcomment = `<li class="more-option-nocomment" value="${element.allow_comment}"><i class="fas fa-comment-slash"></i><span>${noCommentText}</span></li>`
                  }else if(!!(element.allow_comment == 0) &&  !!(element.count_comment > 0)){
                    noCommentText = `فعال کردن یادداشت ها`
                  }else{
                    noCommentText = 'غیر فعال کردن یادداشت ها';
                  }
                  if(!(element.allow_comment == 0)){
                    enabelcomment = `<li class="more-option-nocomment" value="${element.allow_comment}"><i class="fas fa-comment-slash"></i><span>${noCommentText}</span></li>`
                  }
                  if(element.status == 1){
                    // <i class="fas fa-copy" data-bs-toggle="tooltip" data-bs-placement="top" title="برای کپی کردن متن کلیک کنید"></i></i>
                    moreOption = `
                    <i class="fas fa-ellipsis-v"></i>
                    <ul class="more-option-list">
                      <li class="more-option-copy" data-bs-toggle="tooltip" data-bs-placement="top" title="برای کپی کردن متن کلیک کنید"><i class="far fa-copy"></i><span>کپی کردن متن</span></li>
                      <li class="more-option-share"><i class="fas fa-share-alt"></i><span>اشتراک گذاری</span></li>
                      <li class="more-option-recipient"><i class="fas fa-user-friends"></i><span>لیست دریافت کنندگان</span></li>
                      ${enabelcomment}
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
                            <div class="row message-body" >
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
                  }
              });
          }
          out = 
          `<div style="overflow: auto;" class="conversation_body">
              <div class="row last_message lastMoreMessage">
                <div class="spinner-border text-secondary" role="status" style="top: inherit; right: 50%; height: 22px; display: block;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              ${out}
              <div class="row last_message moreMessage">
                <div class="spinner-border text-secondary" role="status" style="top: inherit; right: 50%; height: 22px; display: block;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
          </div>`
          $('.conversation_empty').hide();
          
          $("#conversation .conversation_message").html(out);
          $('.conversation_comment').css({height: "100%"});
          // $('.conversation_message').css({height: "100%"});
          $('.conversation_comment').hide();
          $('.conversation_message').show();
          if(scrollEndMsg == 'showMore'){
            $('#conversation').animate({ scrollTop: 20 });
          }else if(notReadMsg[0]){
            for (let i = 0; i < $('.message-body a').length; i++) {
              if($('.message-body a')[i].id == notReadMsg[0]){
                let $scrollTo =$(`#${notReadMsg[0]}`);
                let $container =  $("#conversation");
                $container.animate({
                  scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
                });
                break;
              }
            }
            ChanleList();
          }else if(scrollEndMsg == 'clickChanel'){
            $('#conversation').animate({ scrollTop: $('.conversation_message')[0].scrollHeight - 30 });
            ChanleList();
          }else{
            $('#conversation')[0].scrollTop =  $('.conversation_body')[0].scrollHeight - 30; 
          }
          conversation = out;
          commentBox = 'close';
        }else{
          Swal.fire({
            icon: 'error',
            title: res.data.message,
            showConfirmButton: false,
            timer: 2000
          });
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
}

// ************************* play audio ****************************
let player =(session ,file__id )=>{
  
  let out = '';
    out = `
          <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}" type="audio/mpeg">
    `;
    $('audio').html(out);
}

$('.close_player').on("click",function () {
  $('.play_audio').removeClass('run_player');
  $('.box_player audio').trigger("pause");
  let out = ` <audio controls="" autoplay="" name="media"></audio>`
  $('.box_player audio').replaceWith(out);
 
});

// ************************* handle load more by scroll conversation ****************************
$("#conversation").scroll(function() {
  let height = $('#conversation')[0].scrollHeight - $('#conversation').height();
  height = Math.round(height);
  let scrollTop =  $('#conversation').scrollTop();
  scrollTop = Math.round(scrollTop);
  cuntNotReadNews =$(`.sideBar #${chanel_id} .count_not_read`)[0];
  if (cuntNotReadNews) {
    cuntNotReadNews = parseInt(cuntNotReadNews.innerText)
  }else{
    cuntNotReadNews = 0;
  }
  if( height == scrollTop  && cuntNotReadNews)  {
    get_news_channel( 15, chanel_id,'clickChanel');
  }
  if ( scrollTop == 0 ){
    if(lastRow + 1 >= row && commentBox !== 'open'){
      row = row + 5;
      get_news_channel( row , chanel_id , 'showMore');
    }
  }
});
// ************************* handle click window and conversation ****************************
$(window).on('click', function(e) {

  // *** download file ***

  let file__id = e.target.id;
  if(!(session == '') && file__id && (e.target.className == 'fas fa-download' || e.target.className == 'fas fa-cloud-download-alt audio_play' || e.target.className == 'far fa-arrow-alt-circle-down')){
    $.ajax({
      url:`http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}`,
      type: "get",
      beforeSend: function(){
        $(`#${file__id}`).css({display : 'none'});
        $(`#${file__id} + .spinner-border`).css({display : 'block'});
      },
      success: function(response) {
        try{
          let res = jQuery.parseJSON(response);
          console.log(res);
          if(res.ResultCode == 4001){
            get_session_archive()
          }
        }catch{
          if(e.target.className == 'fas fa-cloud-download-alt audio_play' && ($(e.target)[0].attributes.type.value == 'aac' || $(e.target)[0].attributes.type.value == 'mp3' || $(e.target)[0].attributes.type.value == 'mpeg')){
            $('.play_audio').addClass('run_player');
            $(`#${file__id}`).css({display : 'block'});
            $(`#${file__id} + .spinner-border`).css({display : 'none'})
            player(session , file__id);
            
          }else{
            $(`#${file__id}`).css({display : 'block'});
            $(`#${file__id} + .spinner-border`).css({display : 'none'})
            let win = window.open(`http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${file__id}`, '_blank');
            if(win){
              win.focus();
            }else{
              alert('Please allow popups for this website');
            }
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
  
  // *** clear box msg after click other chanel ***
  
  if(!$(e.target).parents('.conversation').length && !$(e.target).parents('.fg-emoji-container').length && !$(e.target).parents('.reply_to_content_box').length && !$(e.target).parents('.span_prv_archive').length){
    $('textarea.form-control').val('');
  }

  // *** clear box msg after click other chanel *** 

  if(!$(e.target).parents('.conversation').length){
    if($('.reply_to').children().length == 0){
      $('.reply_to').html('');
      $('.reply_to').hide();
      if($('.prv_file').children().length){
        $('.conversation_comment').css({height: '84%'});
      }else{
        $('.conversation_comment').css({height: '100%'});
      }
    }
    
  }

  // *** reset textarea css *** 

  if(!$(e.target).parents('#conversation').length && !$(e.target).parents('.reply').length){
    multiline()
  }

});

// ************************* heading conversation ****************************
$('.heading-back').on('click', function() {
  ChanleList();
    $('.side').show();

});

$(".heading-refresh i").on("click", function() {
  if(commentBox == 'open'){
    get_comment_reply(primery_id,headePost)
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
        $('.reply-send i.fa-send').replaceWith('<div class="spinner-grow text-success" role="status" style = "height: 2rem;"><span class="sr-only">Loading...</span></div>');
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
          let res = jQuery.parseJSON(response);
          $('.reply-send .spinner-grow').replaceWith('<i class="fa fa-send fa-2x" aria-hidden="true "></i>');
          if (res.result == 'ok') {
            if(!!$('.prv_file').children().length){
              $('.upload_img_success').css({display : 'block'});
              $('.upload_msg_success').css({display : 'block'});
            
              setTimeout(function(){
                $('.msg_upload_bg').css({visibility: "hidden"});
                $('.upload_img_success').css({display : 'none'});
                $('.upload_msg_success').css({display : 'none'});
                $('.sending').css({display : 'inline-flex'});
              },5000);
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
              }, 5000);
              listArchive = [];
             }
            $('textarea.form-control').val('')
            get_news_channel(15 , chanel_id);
          }else{
            console.log(res);
            Swal.fire({
              icon: 'error',
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500
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
}

$('.reply-send').on('click', 'i', function() {
    sendData = 'send';
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

// ************************* handle textarea multiline css ****************************
let multiline = () =>{
  let text = $('textarea.form-control').val().split('\n')
  if(text.length < 1){
    $('.reply-main textarea').css({overflow : 'auto'}); 
  }else if(text.length == 1){
    $('#conversation').css({height : 'calc(100% - 120px)'});
    $('.reply').css({height : '60px'});
    $('.reply-main').css({height : 'auto'});
    $('.reply-main textarea').css({overflow : 'hidden'});
    $('.prv_file').css({bottom : '60px'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '85%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '85%'});
      $('.reply_to').css({bottom : '60px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      console.log('ok');
      $('.conversation_comment').css({height : '68%'});
      $('.reply_to').css({bottom : '139px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else if(text.length == 2){
    $('#conversation').css({height : 'calc(100% - 144px)'});
    $('.reply').css({height : '84px'});
    $('.reply-main').css({height : '57px'});
    $('.reply-main textarea').css({overflow : 'hidden'});
    $('.prv_file').css({bottom : '84px'});
    $('.reply_to').css({bottom : '163px'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '83%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '83%'});
      $('.reply_to').css({bottom : '84px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      $('.conversation_comment').css({height : '68%'});
      $('.reply_to').css({bottom : '163px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else if(text.length == 3){
    $('#conversation').css({height : 'calc(100% - 160px)'});
    $('.reply').css({height : '100px'});
    $('.reply-main').css({height : '77px'});
    $('.reply-main textarea').css({overflow : 'hidden'});
    $('.prv_file').css({bottom : '100px'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '82%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '83%'});
      $('.reply_to').css({bottom : '100px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      $('.conversation_comment').css({height : '67%'});
      $('.reply_to').css({bottom : '179px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else if(text.length == 4){
    $('#conversation').css({height : 'calc(100% - 175px)'});
    $('.reply').css({height : '119px'});
    $('.reply-main').css({height : '100px'});
    $('.reply-main textarea').css({overflow : 'hidden'});
    $('.prv_file').css({bottom : '115px'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '82%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '83%'});
      $('.reply_to').css({bottom : '115px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      $('.conversation_comment').css({height : '64%'});
      $('.reply_to').css({bottom : '194px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else if(text.length == 5){
    $('#conversation').css({height : 'calc(100% - 200px)'});
    $('.reply').css({height : '144px'});
    $('.reply-main').css({height : '122px'});
    $('.reply-main textarea').css({overflow : 'hidden'});
    $('.prv_file').css({bottom : '140px'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '81%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '81%'});
      $('.reply_to').css({bottom : '140px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      $('.conversation_comment').css({height : '62%'});
      $('.reply_to').css({bottom : '219px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else if(text.length == 6){
    $('#conversation').css({height : 'calc(100% - 227px)'});
    $('.reply').css({height : '168px'});
    $('.reply-main').css({height : '150px'});
    $('.reply-main textarea').css({overflow : 'hidden'});
    $('.prv_file').css({bottom : '167px'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '81%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '81%'});
      $('.reply_to').css({bottom : '167px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      $('.conversation_comment').css({height : '62%'});
      $('.reply_to').css({bottom : '246px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else if(text.length > 6){
    $('#conversation').css({height : 'calc(100% - 227px)'});
    $('.reply').css({height : '168px'});
    $('.reply-main').css({height : '150px'});
    $('.prv_file').css({bottom : '167px'});
    $('.reply-main textarea').css({overflow : 'auto'});
    if ($('.prv_file').children().length && $('.reply_to').css('display') == 'none') {
      $('.conversation_comment').css({height : '81%'});
    }else if($('.reply_to').css('display') == 'block' && !($('.prv_file').children().length)){
      $('.conversation_comment').css({height : '81%'});
      $('.reply_to').css({bottom : '167px'});
    }else if($('.reply_to').css('display') == 'block' && $('.prv_file').children().length){
      $('.conversation_comment').css({height : '62%'});
      $('.reply_to').css({bottom : '246px'});
    }else{
      $('.conversation_comment').css({height : '100%'});
    }
  }else{
    // $('#conversation').css({height : ''});
    // $('.reply').css({height : '60px'});
    // $('.reply-main').css({height : 'auto'});
    // $('.reply-main textarea').css({overflow : 'hidden'});
  }
}
$('textarea.form-control').keyup('',function(){
  multiline()
});
$("textarea.form-control").bind('paste', function(e) {
  
  var that = this;
    setTimeout(function() {
        var length = that.value.length;
        console.log(length);   
        $( "textarea.form-control" ).keyup();
    }, 0);
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
        $('.prv_file').html(preview_file);
        $('.msg_upload_lists').html(uploadFileShowModal);
        if ($('.prv_file').children().length){
          $('.prv_file').css({ visibility: "inherit"})
        }
    }
    if(commentBox == 'open') {
      
      multiline()
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
          if($('.reply_to').children().length){
            $('.reply_to').css({bottom: '60px'});
            $('.conversation_comment').css({height: '83%'});
            }
          if ($('.prv_file').children().length == 1){
            $('.prv_file').css({ visibility: "hidden" });
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
          ($(`li#${file.id} img`)).attr('id' , myresponse.Data.File_id)
          if (myresponse['Result'] === "Ok") {
            $(`#${file.id} .fileProgress`).hide();
            $(`.msg_upload_lists li#${file.id}`).children('h5.icon').html('<i class="fas fa-check-circle"></i>')
            $('.upload_img_success h4').html(myresponse.Data.Message)
          } else {
            $(`#${file.id} .fileProgress`).hide();
            $(`.msg_upload_lists li#${file.id}`).children('h5.icon').html('<i class="fas fa-exclamation-triangle"></i>')
            $('.upload_img_faile h4').html(myresponse.Data.Message)
            errUploadedFile = false;
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
      if(sendData == 'send'){
        $('.upload_img_success').css({display : 'block'})
      }
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
      if(listArchive.length){
        listArchive = JSON.stringify(listArchive);
      }
      let textInsertMessage = $('textarea.form-control').val().trim();
      if(commentBox == 'open'){
        if(!!$($('.reply_to')).children().length){
          let h6ClassId = $('.reply_to_content_box h6')[0].outerHTML
          h6ClassId = h6ClassId.slice(h6ClassId.search('"')+1,h6ClassId.length)
          h6ClassId = h6ClassId.slice(0 , h6ClassId.search('"'));
          if(sendData == 'send'){
            sendcomment(textInsertMessage , h6ClassId ,listArchive , postId)
          }else{
            console.log('error');
          }
          $('.reply_to').html('');
          $('.reply_to').hide();
          $('.conversation_comment').css({height: 'auto'});
        }else{
          if (sendData == 'send') {
            sendcomment(textInsertMessage , '',listArchive , postId)
          }else{
            console.log('error');
          }
        }
      }else{
        if (sendData == 'send') {
          sendMessage(chanel_id , textInsertMessage , listArchive )
        }else{
          console.log('error',sendData);
        }
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

// ************************* Cancel-send ****************************
$('.Cancel-send').on('click' , function () {
    sendData = 'Cancel';
    $(`.upload_img_success`).css({display : 'none'});
    $(`.upload_img_faile`).css({display : 'none'});
    $(`.upload_msg_success`).css({display : 'none'});
    $(`.upload_msg_faile`).css({display : 'none'});
    $(`.msg_upload_bg`).css({visibility : 'hidden'});
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
      listArchive = [];
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
let get_comment_reply = (id , componentthispost) =>{
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
        let msg = componentthispost;
        let archive = '';
        let name_family = '';
        let moreOption = '';
        let commentsArry = [];
        let commentObject = {};
        let text = '';
        comment_list.forEach((element) => {
          text = element.text
              let regexlink = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
              // Replace plain text links by hyperlinks
              text = text.replace(regexlink, "<a href='$1' target='_blank'></a>");
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
                  replyComment = `<a class="reply_comment" href="#${element.reply_to}"> <h5>در پاسخ به:</h5><h6 class="${element.reply_to}">${elem.description}</h6> </a> <br>`;
                }else{
                  replyComment = `<a class="reply_comment" href="#${element.reply_to}"> <h5>در پاسخ به:</h5><h6 class="${element.reply_to}">${elem.fileName}</h6> </a> <br>`;
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
                    show_file +=`
                    <div class="archive_view_comment">
                      <img class="archive_view_comment" src="./assets/images/pdf.png" alt="${element.file_name}"></img> 
                      <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i>
                      <div class="spinner-border text-info" role="status">
                                <span class="sr-only">Loading...</span>
                      </div>
                    </div>`;
                  }else if (fileType == 'aac'|| fileType =='mp3' ){
                    show_file +=` <audio controls>
                    <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" type="audio/ogg">
                    <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" type="audio/mpeg">
                  </audio>`;
                  }else if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif') {
                    show_file +=`
                    <div class="archive_view_comment" >
                      <img class="archive_view_comment" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt="${element.file_name}"></img>
                      <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i>
                      <div class="spinner-border text-info" role="status">
                              <span class="sr-only">Loading...</span>
                      </div>
                    </div>`;
                  }else{
                    show_file +=`
                    <div class="archive_view_comment" >
                      <img class="archive_view_comment" src="./assets/images/document_icon.png" alt="${element.file_name}"></img> 
                      <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i>
                      <div class="spinner-border text-info" role="status">
                                <span class="sr-only">Loading...</span>
                      </div>
                    </div>`;
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
        out = 
        `
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
        $('.comment-box')[0].scrollTop =  $('.comment-box')[0].scrollHeight;
    }
});
}

$('.conversation').on('click', '.comment', function(e) {
  e.preventDefault();
  if ($(this).parents('div.receiver').length) {
    let name = '';
    let text = $(this).parents('div.receiver').children('div.message-text').html();
    let archiveBox = $(this).parents('div.receiver').children('div.archive_box').html();
    if (archiveBox) {
      archiveBox = `<br> <div class="archive_box">
      ${archiveBox}
      </div> <br>`
    }else{
      archiveBox = ``
    }
    headePost =
    `
    <div class="row post_comment" style="height: auto; margin: inherit;">
          <div class="col-sm-12 message-main-sender">
            <div class="sender" style = "height: auto !important;">
              <span class="contact_name">${name}</span>
              <div class="message-text">${text}</div>
              ${archiveBox}
              <br>
            </div>
          </div>
      </div>
    `
  }
  if ($(this).parents('div.sender').length) {
    let name = $(this).parents('div.sender').children('span.contact_name').html();
    let text = $(this).parents('div.sender').children('div.message-text').html();
    let archiveBox = $(this).parents('div.sender').children('div.archive_box').html();
    if (archiveBox) {
      archiveBox = `<br> <div class="archive_box">
      ${archiveBox}
      </div> <br>`
    }else{
      archiveBox = ``
    }
    headePost =
    `
    <div class="row post_comment" style="height: auto; margin: inherit;">
          <div class="col-sm-12 message-main-sender">
              <div class="sender" style = "height: auto !important;">
              <span class="contact_name">${name}</span>
              <div class="message-text">${text}</div>
              ${archiveBox}
              <br>
            </div>
          </div>
      </div>
    `
    
  }
    $('textarea.form-control').val('');
    primery_id = e.currentTarget.id;
    comment_id = $(this)[0].id
    get_comment_reply(primery_id ,headePost);
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
    let $scrollTo = $(`#${comment_id}`);
    let $container =  $("#conversation");
    $container.animate({
      scrollTop: $scrollTo.offset().top - 150
    },'slow');
});

// ************************* go to replay handle ****************************
$(".conversation").on('click','.reply_comment' , function(e) {
	e.preventDefault();
  if($($($(this).attr("href")).children()[0]).hasClass( "go_to_reply" )){
    $($($(this).attr("href")).children()[0]).removeClass('go_to_reply');
  }
  let $scrollTo = $(`#${$($(this).attr("href")).attr('id')}`);
  let $container =  $(".comment-box");
  $container.animate({
    scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
  },'slow');
  
  $($($(this).attr("href")).children()[0]).addClass('go_to_reply');
  
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
  get_comment_reply(primery_id,headePost);
  commentBox = 'open';
  postId = $(e.target).parents()[1].id;
});

// more-option-copy ****************************
$('.conversation').on('click','.more-option-copy',function(e){
  let regexlink = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  let regexEnter = /<br\s*[\/]?>/gi;
  let $temp = $("<input>");
  $("body").append($temp);
  if($(e.target).parents("div.receiver").length){
    $temp.val($(e.target).parents("div.receiver").children("div.message-text").html().replace(regexEnter,"\n").replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
  }else{
    $temp.val($(e.target).parents("div.sender").children("div.message-text").html().replace(regexEnter,"\n").replace("<a href='$1' target='_blank'>$1</a>",regexlink)).select();
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
  $('div.member-seen').css({display: 'block'});
  let newsid = $(this).parents('div.receiver').children('a').attr('id')
  if(!(newsid)){
    newsid = $(this).parents('div.sender').children('a').attr('id')
  }
  if (newsid){
    
    list_receiver_news_channel(newsid)
  }
 
});

// more-option-nocomment ****************************
$('.conversation').on('click','.more-option-nocomment',function(e){
  let allowvalueComment = $(e.target).parents('li.more-option-nocomment')[0].value;
  
  let noCommentId = $(e.target).parents('div.sender').children('a').attr('id');
  if(!noCommentId){
    noCommentId = $(e.target).parents('div.receiver').children('a').attr('id');
   }
   if(allowvalueComment == 1){
    allowvalueComment = allowvalueComment-1 ;
   }else{
    allowvalueComment = allowvalueComment+1 ;
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
  multiline()
});

$('.reply_to').on('click','i.fa-times-circle',function(){
  $('.reply_to').html('');
  $('.reply_to').hide();
  if($('.prv_file').children().length){
    $('.conversation_comment').css({height: '84%'});
  }else{
    $('.conversation_comment').css({height: 'auto'});
  }
  
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
      $('.reply-send i.fa-send').replaceWith('<div class="spinner-grow text-success" role="status" style = "height: 2rem;"><span class="sr-only">Loading...</span></div>');
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
          let res = jQuery.parseJSON(response);
          $('.reply-send .spinner-grow').replaceWith('<i class="fa fa-send fa-2x" aria-hidden="true "></i>');
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
            get_comment_reply(primery_id,headePost);
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
              swalWithBootstrapButtons.fire({
                title: 'حذف شد!',
                text: 'پیام شما با موفقیت حذف شد',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
              })
              get_comment_reply(primery_id,headePost)
            }else{
              swalWithBootstrapButtons.fire({
                title: 'عملیات انجام نشد',
                text: res.data.message,
                icon: res.result,
                showConfirmButton: false,
                timer: 1500,
              });
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

//**************create new chanel
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
          ChanleList();
          $(".close_add").click();
        }else{
          console.log();
          arrymember = [];
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
    if($(`.chanel_list_member li#${member__id} .member_admin input`).prop('checked')){
      is_admin = 1
    }else{
      is_admin = 0
    }
    let arrymemberobject = {
        "member__id" : member__id,
        "is_admin" : is_admin
      }
      arrymember = $.grep(arrymember, function(e){ 
        return e.member__id !== member__id; 
      });
    arrymember.push(arrymemberobject);
  }
  insert_channel(chanelData , arrymember);
});

//************** show wizard => add chanel
$(".new-chanel").click(function() {
    $(".add_new_channel").css({ visibility: "inherit" });
});

//************* close wizard box => add chanel
$(".close_add").click(function() {
  chanelData =[];
  allmember = [];
  arrymember = [];
  chanelImage = ``;
  $('#channelName').val('')
  memberInfo = []
  sendMemberToNextStep(memberInfo ,'' , 'next' )
  removeImgChanel(imgChanelUpload);
  $(`#profile-pic img`).attr('src','./assets/images/gallery.png')
    $(".add_new_channel").css({ visibility: "hidden" });
    $('.step_2').css({ display: "none" });
    $('.step_3').css({ display: "none" });
    $('.step_1').css({ display: "block" });
    $('.step_1 .enable_comments input').prop('checked' , false);

});

//************* next step1 to step2 wizard box => add chanel
$('.step_1 .next_btn button').on('click', function(){
  $('.added_person').css({visibility : "hidden"});
  let chanelName = $('#channelName').val();
  let allowComment = 0;
  if(!(chanelName == '')){
    imgChanelUpload.start()
    if($('#comment_on').prop( "checked" )){
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

//************* preve step2 to step1 wizard box => add chanel
$('.preve_step_1 button').on('click', function(){
  $('.step_2').css({ display: "none" });
  $('.step_1').css({ display: "block" });
});

//************* next step2 to step3 wizard box => add chanel
$('.step_2 .next_btn button').on('click', function(){
  if(allmember.length){
    $('.step_2').css({ display: "none" });
    $('.step_3').css({ display: "block" });
    sendMemberToNextStep(memberInfo , '' , 'next')
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

//************* preve step3 to step2 wizard box => add chanel
$('.preve_step_2 button').on('click', function(){
  $('.step_3').css({ display: "none" });
  $('.step_2').css({ display: "block" });
  $('.added_person').css({ visibility: "hidden" });
  let member__id = ''
  let is_admin = 0 ;
  for (let i = 0; i < $('.chanel_list_member').children().length; i++) {
    member__id = $('.chanel_list_member').children()[i].id;
    if($(`.chanel_list_member li#${member__id} .member_admin input`).prop('checked')){
      is_admin = 1
    }else{
      is_admin = 0
    }
    let arrymemberobject = {
        "member__id" : member__id,
        "is_admin" : is_admin
      }
      arrymember = $.grep(arrymember, function(e){ 
        return e.member__id !== member__id; 
      });
    arrymember.push(arrymemberobject);
  }
});

//************* upload image wizard box => add chanel

$("#profile-image1").on("click", function() {
  removeImgChanel(imgChanelUpload);
  $("#profile-image-upload").click();
});
let imgChanelUpload = new plupload.Uploader({
  browse_button: 'profile-image-upload',
  chunk_size:(200*1024) + 'b',
  max_retries: 3,
  url: 'http://archive.atiehsazan.ir/Api/Upload/index.php',
  multipart_params: {
      chunk_size: 200*1024,
  },
  filters : [
    {title : "Image files", extensions : "jpg,jpeg,png"},
  ],
});
imgChanelUpload.init();
imgChanelUpload.bind('FilesAdded', function (up, files) {
  handelJustOneFile(imgChanelUpload.files , imgChanelUpload);
});
imgChanelUpload.bind('UploadProgress',function (up, file ) {
  UploadProgress(up, file , '#profile-pic');
  
});
imgChanelUpload.bind('Error', function (up, err) {});
imgChanelUpload.bind('FileUploaded', function (up, file, info) {
  FileUploaded(up, file, info , '#profile-pic')
});
imgChanelUpload.bind('ChunkUploaded', function (up, file, info) {});
imgChanelUpload.bind('UploadComplete', function (up, file , info) {
  UploadCompleted (up, file , info ,imgChanelUpload)
});

let handelJustOneFile = (files , tarrgetElement)=>{
  if(tarrgetElement.files.length > 1){
    for ( let i = 0 ; i < files.length ; i++ ) {
      tarrgetElement.removeFile(files[i]);
    }
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
      title: 'شما نمیتوانید چند فایل انتخاب کنید'
    });
  }else{
    tarrgetElement.start();
  }
} 
let UploadProgress = (up, file , tarrgetId) =>{
  let $fa_camera = ($(`${tarrgetId} .fa-camera`));
  let display = 'display: grid;'
  if($fa_camera.length){
    $fa_camera.hide();
    display = 'display: contents;'
  }
  $(`${tarrgetId} .fileProgress`).show();
    let progress = 0;
    progress += file.percent ;
    if (progress == 100) {
      $(`${tarrgetId} img`).attr('src','./assets/images/white.png')
    }
    $(`${tarrgetId}`).children('h5.fileProgress').children()[0].style.cssText = `--value:${progress}; --size:100px; ${display}`;
}
let FileUploaded = (up, file, info , tarrgetId) =>{
  $(`${tarrgetId} .fileProgress`).hide();
  let myresponse = $.parseJSON(info['response']);
  chaneleImgId = myresponse.Data.File_id;
  if(myresponse.ResultCode == '200'){
    $(`${tarrgetId} img`).attr('src' , `http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${file._options.params.Session_id}&File_id=${chaneleImgId}`)
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
      title: myresponse.Data.Message,
    })
  }
  
}
let UploadCompleted = (up, file , info , targetElement) =>{
chanelImage = {}
$.each(targetElement.files, function (i, file) {
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
});
}
let removeImgChanel = (tarrget) =>{
  $.each(tarrget.files, function (i, file) {
    tarrget.removeFile(file);
  });
  
}

// *********** delete member final step wizard box => add chanel
$('.chanel_list_member').on('click','.member_delete i',function(){
  let tagetId = $(this).parents('li').attr('id');
  memberInfo = $.grep(memberInfo, function(e){ 
    return e.id != tagetId; 
  });
  sendMemberToNextStep(memberInfo ,'' , 'next' )
});

// *********** add teacher for add new chanel and  update member chanel in the edite chanel 

let get_list_teacher = (Location)=>{
  $.ajax({
    url: api_address + "/users/get_list_teacher",
    type: "post",
    data: {
      status : 'all',
    },
    beforeSend: function(request) {
      let loading =
      `
      <li class="loadinglist">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </li>
      `
      if(Location == 'update-chanel'){
        $('.users-list-chanel').html(loading)
      }
      if(Location == 'add-chanel'){
        $('.person_list').html(loading)
      }
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_teacher = res.data.Rows;
          techerlist = list_teacher;
          let out_list_techer = ``
          let input = '<input type="checkbox">'
          list_teacher.forEach(element => {
            if(Location == 'update-chanel'){
              upadtememberchanel.forEach(elem =>{
                if(elem.member__id == element.teacher__id){
                  input = `<input type="checkbox" checked>`
                }
              });
              addmembers.forEach(el => {
               if(el.user__id == element.teacher__id){
                 input = `<input type="checkbox" checked disabled>`
                }
              });
              out_list_techer +=
              `
              <li id="${element.teacher__id}">
              <i class="fas fa-chalkboard-teacher"></i>
                <p>${element.name} ${element.family}</p>
                ${input}
              </li>
              `
              input = `<input type="checkbox">`
            }else if(Location == 'add-chanel'){
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
            }
            
          });
          if(Location == 'update-chanel'){
            
            $('.users-list-chanel').html(out_list_techer)
          }else if(Location == 'add-chanel'){
            $('.person_list').html(out_list_techer)
          }
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
  checkSellectInput('.header_person_box_checkbox input','.person_checkbox input')
  $('.title_added_person h5').html('انتخاب معلم');
  if (techerlist == ''){
    get_list_teacher('add-chanel');
  }else{
    handelUsersList('teacher','add-chanel');
  }
  $(".added_person").css({ visibility: "inherit" });
  $(".person_list").css({ visibility: "inherit" });
  $("li.student .accordion-wrapper .accordion").prop('checked' , false)

});

// *********** add personel for add new chanel and  update member chanel in the edite chanel 
let get_list_personel = (Location)=>{
  $.ajax({
    url: api_address + "/users/get_list_personel",
    type: "post",
    beforeSend: function(request) {
      let loading =
      `
      <li class="loadinglist">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </li>
      `
      if(Location == 'update-chanel'){
        $('.users-list-chanel').html(loading)
      }
      if(Location == 'add-chanel'){
        $('.person_list').html(loading)
      }
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_personel = res.data.Rows;
          personelList = list_personel;
          let out_list_personel= ``
          let input = '<input type="checkbox">'
          list_personel.forEach(element => {
            if(Location == 'add-chanel'){
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
            }else if(Location == 'update-chanel'){
              upadtememberchanel.forEach(elem =>{
                if(elem.member__id == element.personel__id){
                  input = `<input type="checkbox" checked>`
                }
              });
              addmembers.forEach(el => {
                if(el.user__id == element.personel__id){
                  input = `<input type="checkbox" checked disabled>`
                 }
               });

              out_list_personel += 
              `
              <li id = "${element.personel__id}">
              <i class="fas fa-user-tie"></i>
                <p>${element.f_name} ${element.l_name}</p>
                ${input}
              </li>
              
              `
              input = `<input type="checkbox">`
            }
            
          });
          if(Location == 'add-chanel'){
            $('.person_list').html(out_list_personel)
            enablechecked()
          }else if(Location == 'update-chanel'){
            $('.users-list-chanel').html(out_list_personel)
          }
          
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
  checkSellectInput('.header_person_box_checkbox input','.person_checkbox input')
  $('.title_added_person h5').html('انتخاب پرسنل');
  if (personelList == '') {
    get_list_personel('add-chanel')
  }else{
    handelUsersList('personel','add-chanel');
  }
  $(".added_person").css({ visibility: "inherit" });
  $(".person_list").css({ visibility: "inherit" });
  $("li.student .accordion-wrapper .accordion").prop('checked' , false)
});

// *********** add student and get list of class for add new chanel and  update member chanel in the edite chanel 
let classes_of_branch = (Location)=>{
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
          studentList = list_student
          let out_list_student = ``
          list_student.forEach(element => {
            if(Location == 'student'){
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
            }else if(Location == 'position-student'){
              out_list_student += 
            `
            <li id="${element.class__id}">
              <i class="fas fa-book-open"></i>
              <p id="${element.branch__id}">${element.name_class}</p>
              <span></span>
              <hr>
            </li>

            `
            }
            
          });
          if(Location == 'student'){
            $('.classesOfBranch').html(out_list_student)
          }else if(Location == 'position-student'){
            $('.student-term').html(out_list_student)
          }
          
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
            icon: res.result,
            title: res.data.message,
          })
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
let list_student_of_class = (classid , branchid , Location)=>{

  $.ajax({
    url: api_address + "/amoozesh/list_student_of_class",
    type: "post",
    data:{
      class__id : classid,
      branch__id : branchid
    },
    beforeSend: function(request) {
      let loading =
      `
      <li class="loadinglist">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </li>
      `
        if(Location == 'classesOfBranch'){
          $('.person_list').html(loading)
        }
        if(Location == 'student-term'){
          $('.users-list-chanel').html(loading)
        }
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_student = res.data.Rows;
          let out_list_student= ``
          let input = '<input type="checkbox">'
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
            if(Location == 'classesOfBranch'){
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
            }else if(Location == 'student-term'){
              upadtememberchanel.forEach(elem =>{
                if(elem.member__id == element.student__id){
                  input = `<input type="checkbox" checked>`
                }
              });
              addmembers.forEach(el => {
                if(el.user__id == element.student__id){
                  input = `<input type="checkbox" checked disabled>`
                  
                 }
               });
              out_list_student += 
              `
              <li id = "${element.student__id}">
              <i class="fas fa-user-graduate"></i>
                <p>${element.name} ${element.family}</p>
                ${input}
              </li>
              `
              input = `<input type="checkbox">`
            }
            
          });
          if(Location == 'classesOfBranch'){
            $('.person_list').html(out_list_student);
            enablechecked()
            // $(".add_btn_person").css({ visibility: "inherit" });
            $(".added_person").css({ visibility: "inherit" });
            $(".person_list").css({ visibility: "inherit" });
          }else if(Location == 'student-term'){
            $('.users-list-chanel').html(out_list_student)
          }
         
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
  if (studentList == '') {
    classes_of_branch('student')
  }else{
    handelUsersList('student');
  }
  checkSellectInput('.header_person_box_checkbox input','.person_checkbox input')
});
$('.classesOfBranch').on('click','li',function () {
  $('.title_added_person h5').html($(this).text());
  let classid = this.id;
  let branchid = $(this).children('p').attr('id');
  list_student_of_class(classid , branchid , 'classesOfBranch')
});

// *************** handel user list for Reduce requset to server
let handelUsersList = (roll,location)=>{
  if (roll == 'teacher') {
          let out_list_techer = ``
          let input = '<input type="checkbox">'
          techerlist.forEach(element => {
           
            if(location == 'update-chanel'){
             
              addmembers.forEach(el => {
               if(el.user__id == element.teacher__id){
                 input = `<input type="checkbox" checked>`
                }
              });
              out_list_techer +=
              `
              <li id="${element.teacher__id}">
              <i class="fas fa-chalkboard-teacher"></i>
                <p>${element.name} ${element.family}</p>
                ${input}
              </li>
              `
              input = `<input type="checkbox">`
            }else if(location == 'add-chanel'){
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
            }
            
          });
          if(location == 'update-chanel'){
            $('.users-list-chanel').html(out_list_techer)
          }else if(location == 'add-chanel'){
            $('.person_list').html(out_list_techer)
          }
          enablechecked()
  }
  if(roll == 'personel'){
    let out_list_personel= ``
    let input = '<input type="checkbox">'
    personelList.forEach(element => {
      if(location == 'add-chanel'){
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
      }else if(location == 'update-chanel'){
        addmembers.forEach(el => {
          if(el.user__id == element.personel__id){
            input = `<input type="checkbox" checked>`
            
           }
         });

        out_list_personel += 
        `
        <li id = "${element.personel__id}">
        <i class="fas fa-user-tie"></i>
          <p>${element.f_name} ${element.l_name}</p>
          ${input}
        </li>
        
        `
        input = `<input type="checkbox">`
      }
      
    });
    if(location == 'add-chanel'){
      $('.person_list').html(out_list_personel)
      enablechecked()
    }else if(location == 'update-chanel'){
      $('.users-list-chanel').html(out_list_personel)
    }
  }
  if(roll == 'student'){
    let out_list_student = ``
    studentList.forEach(element => {
      if(roll == 'student'){
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
      }else if(roll == 'position-student'){
        out_list_student += 
      `
      <li id="${element.class__id}">
        <i class="fas fa-book-open"></i>
        <p id="${element.branch__id}">${element.name_class}</p>
        <span></span>
        <hr>
      </li>

      `
      }
      
    });
    if(roll == 'student'){
      $('.classesOfBranch').html(out_list_student)
    }else if(roll == 'position-student'){
      $('.student-term').html(out_list_student)
    }
  }
}

// *************** input sellect all member for  => add chanel
$( ".header_person_box_checkbox input" ).change(function() {
  if ($('.person_checkbox input').length) {
    selectAndUnsellect($(this) , '.person_checkbox input');
  }else{
    $('.header_person_box_checkbox input').prop('checked' , false)
  }
});

// *************** input sellect member for  => add chanel
$('.person_list').on('change','.person_checkbox input',function() {
  let $input = $( this );
  let name = ''
  let posion = ''
  if ($input.parents('li.teacher').length){
    name = $input.parents('li.teacher').children('div.person_name').children().text();
    posion = 'teacher'
  }else if($input.parents('li.personel').length){
    name = $input.parents('li.personel').children('div.person_name').children().text();
    posion = 'personel'
  }else if($input.parents('li.student').length){
    name = $input.parents('li.student').children('div.person_name').children().text();
    posion = 'student'
  }
  if($input.prop('checked')){
    let creatObjectMember =
      {
        "name" : name,
        "id" : $input.attr('id'),
        "termDescription" : $('.title_added_person').text(),
        "posion" : posion,
      }
      memberInfo.push(creatObjectMember);
    }
    if(!($input.prop('checked'))){
      memberInfo = $.grep(memberInfo, function(e){ 
        return e.id != $input.attr('id'); 

      });
    }
    sendMemberToNextStep(memberInfo)

    if($input.is( ":checked" )){
    // $(".add_btn_person").css({ visibility: "inherit" });
  }else{
    $( ".header_person_box_checkbox input" ).prop('checked', false);
  }
});

// ***************  selectAndUnsellect all member function => add chanel
let selectAndUnsellect = (inputAll , inputList , location)=>{
  let unSellectAll = ''
  let listElement = ''
  if (inputAll.prop('checked')) {
    for (let index = 0; index < $(`${inputList}`).length; index++) {
      if(location == 'edit'){
        listElement = $($(`${inputList} input`)[index]).prop('checked')
      }else{
        listElement = $($(`${inputList}`)[index]).prop('checked')
      }
      let id = ($(`${inputList}`)[index]).id;
      if( !(listElement)){
        $(`${inputList}#${id}`).click();
      }
    }
  }
  if (inputAll.prop('checked') == false) {
    
    for (let index = 0; index < $(`${inputList}`).length; index++) {
      if(location == 'edit'){
        listElement = $($(`${inputList} input`)[index]).prop('checked')
        let id = ($(`${inputList}`)[index]).id;
        if(listElement){
          if($($(`${inputList} input`)[index]).attr('disabled') !== 'disabled'){
            $(`${inputList}#${id}`).click();
          }
        }
      }else{
        listElement = $($(`${inputList}`)[index]).prop('checked')
        if(listElement){
          unSellectAll = true
        }else{
          unSellectAll = false
          break;
        }
      }
    }
  }
    if (unSellectAll) {
      $(`${inputList}`).click();
    }
}

// ***************  check input member list for input sellect all function => add chanel
let checkSellectInput = (inputAll , inputList ,roll)=>{
  $(`${inputAll}`).prop('checked' , false);
}

// *************** show all member befor add chanel 

let sendMemberToNextStep = (memberlist , posion , btnevent)=>{
  let outMemberlist = ``;
  if(memberlist !== []){
    allmember = memberlist
  }
  
  if(btnevent == "next"){
    memberlist.forEach(element => {
      if(element.posion == 'teacher'){
        // element.memberlist.forEach(element =>{
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
        // })

      }else if(element.posion == 'personel'){
        // element.memberlist.forEach(element =>{
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
        // });
      }else if(element.posion == 'student'){
        // element.memberlist.forEach(element =>{
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
        // });
      }
    });
    $('.chanel_list_member').html(outMemberlist)
    arrymember.forEach(element => {
      if (element.is_admin) {
        $(`.chanel_list_member li#${element.member__id} .member_admin input`).prop('checked', true);
      }
    });
  }
 
}

// *************** Select input items that have already been selected
let enablechecked = () =>{
  allmember.forEach(element  => {
      $(`.step_2 #${element.id}`).prop('checked', true);
  })
  
}

// ************************* edite channel ****************************

$('.heading-name').on('click' , function () {
  $('.update_info_chanel').css({display:'block'});
  member_channel('heading-name');
});
$('.header_chanel_info .info-edit').on('click' , function(){
  $('.info_chanel').css({display:'none'});
  $('.update-chanel').css({display:'block'});
  $('.menu-list').css({display:'block'});
  $('.footer-update-chanel button').css({display:'none'});
  $('.back-to-info-chanel').css({display:'block'});
  stepLoationUpdate = 'update-chanel';
});
$('.back-to-info-chanel').on('click',function(){
  $('.update-chanel').css({display:'none'});
  $('.info_chanel').css({display:'block'});
  member_channel('heading-name');
});
$('.back-menu-list').on('click',function(){
  stepLoationUpdate = 'update-chanel';
  $('.update-info').css({display:'none'});
  $('.add-admin-chanel').css({display:'none'});
  $('.add-usre-chanel').css({display:'none'});
  $('.back-menu-list').css({display:'none'});
  $('.menu-list').css({display:'block'});
  $('.back-to-info-chanel').css({display:'block'});
  $('.save-change-info').css({display:'none'});
  $('.add-member-update-chanel').css({display:'none'});
  $('.sellect_all-box').css({display:'none'});
  $('.header-update-chanel p.chanle-name').text('منو');
  $('.update-name-chanel input').val('');
  $('.area-box textarea').val('');
  // $('.update_enable_comments input').prop('checked' , true);
  $('.users-list-chanel li').remove();
  removeImgChanel(imgUpdateChanelUpload);
  $(`.uploade-image-chanel img`).attr('src' , './assets/images/blue.png');
  $(`.uploade-image-chanel i.fa-camera`).show();
});
$('.menu-list .menu-edite').on('click' , function(){
  stepLoationUpdate = 'subMenu';
  $('.header-update-chanel p.chanle-name').text('ویرایش کانال');
  $('.back-menu-list').css({display:'block'});
  $('.back-to-info-chanel').css({display:'none'});
  $('.menu-list').css({display:'none'});
  $('.update-info').css({display:'block'});
  $('.save-change-info').css({display:'block'});
  $('.update-name-chanel input').val($('.chanel-name a.heading-name-meta')[0].innerText);
  $('.area-box textarea').val($('.chanel-description p.decription-text')[0].innerText)
  let img = $('.update-headder-info-box .info-img img').attr('src')
  $(".uploade-image-chanel img").attr('src' , img) ;
});
$('.menu-list .menu-users').on('click' , function(){
  upadtememberchanel = [];
  stepLoationUpdate = 'subMenu';
  $('.header-update-chanel p.chanle-name').text('مدیریت اعضاء');
  $('.back-menu-list').css({display:'block'});
  $('.back-to-info-chanel').css({display:'none'});
  $('.menu-list').css({display:'none'});
  $('.add-usre-chanel').css({display:'block'});
  $('.add-member-update-chanel').css({display:'block'});
  member_channel()
});
$('.menu-list .menu-deleteChanel').on('click' , function(){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    
  });
  swalWithBootstrapButtons.fire({
    title: 'آیا کانال حذف شود ؟',
    text: "در صورت کلیک روی گزینه بله کانال حذف خواهد شد!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله',
    cancelButtonText: 'خیر',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      delete_channel(chanel_id , swalWithBootstrapButtons)
    }
  })
});
$('.uploade-image-chanel').on('click',function(){
  removeImgChanel(imgUpdateChanelUpload);
});
let imgUpdateChanelUpload = new plupload.Uploader({
  browse_button: 'uploade-image-chanel',
  chunk_size:(200*1024) + 'b',
  max_retries: 3,
  url: 'http://archive.atiehsazan.ir/Api/Upload/index.php',
  multipart_params: {
      chunk_size: 200*1024,
  },
  filters : [
    {title : "Image files", extensions : "jpg,jpeg,png"},
  ],
});
imgUpdateChanelUpload.init();
imgUpdateChanelUpload.bind('FilesAdded', function (up, files) {
  handelJustOneFile(imgUpdateChanelUpload.files , imgUpdateChanelUpload);
});
imgUpdateChanelUpload.bind('UploadProgress',function (up, file ) {
  UploadProgress(up, file , '.uploade-image-chanel');
  
});
imgUpdateChanelUpload.bind('Error', function (up, err) {});
imgUpdateChanelUpload.bind('FileUploaded', function (up, file, info) {
  FileUploaded(up, file, info , '.uploade-image-chanel')
});
imgUpdateChanelUpload.bind('ChunkUploaded', function (up, file, info) {});
imgUpdateChanelUpload.bind('UploadComplete', function (up, file , info) {
  UploadCompleted (up, file , info , imgUpdateChanelUpload)
});
$('.save-change-info').on('click' , function(){
  let namechanel = $('.update-name-chanel input').val()
  let descriptionchanel = $('.update-description-chanel textarea').val();
  let allow_commentchanel = $('.allow-comment-update-info input#update_comment_on').prop('checked');
  if(allow_commentchanel){
    allow_commentchanel = 1;
    $('#update_comment_on').prop('checked' , true);
  }else{
    allow_commentchanel = 0;
    $('#update_comment_on').prop('checked' , false);
  }
  if(namechanel !== ''){
    update_info_channel(namechanel,descriptionchanel,chanelImage,allow_commentchanel);
  }else{
    Swal.fire({
      icon: 'error',
      title: 'نام کانال باید وارد شود',
      showConfirmButton: false,
      timer: 1500
    })
  }
});
$('.position-teacher').on('click' , function(){
  // upadtememberchanel=[];
  get_list_teacher('update-chanel')
  member_channel('menu-admin')
  $('.sellect_all-box input').prop('checked' , false)
  $('.sellect_all-box').css({display:'block'});

});
$('.position-personel').on('click' , function(){
  // upadtememberchanel=[];
  get_list_personel('update-chanel')
  $('.sellect_all-box input').prop('checked' , false);
  $('.sellect_all-box').css({display:'block'});
});
$('.position-student').on('click' , function(){
  // upadtememberchanel=[];
  classes_of_branch('position-student')
 
});
$('.student-term').on('click' ,'li', function(){
  let classid = $(this).attr('id');
  let branchid = $(this).children('p').attr('id')
  list_student_of_class(classid , branchid , 'student-term')
  $('.sellect_all-box input').prop('checked' , false)
  $('.sellect_all-box').css({display:'block'});
});
$('.users-list-chanel').on('click' ,'li', function(){
  let disabled = $(this).children('input').attr('disabled') !== 'disabled';
  let objectmember = {}
  let presonid = $(this).attr('id');
  let personCheckbox = $(this).children('input').prop('checked');
  let isadmin = 0
  addmembers.forEach(element => {
    if (element.user__id == presonid){
        isadmin = element.is_admin;
    }
  });
  
  if (personCheckbox && disabled) {
    $(this).children('input').prop('checked' , false)
  }else{
    $(this).children('input').prop('checked' , true)
  }
  personCheckbox = $(this).children('input').prop('checked')
  let chekrpead = true;
  if(personCheckbox && disabled){
    objectmember =
    {
      "member__id" : presonid,
      'is_admin' : isadmin,
    }
    if(!(upadtememberchanel.length)){
      upadtememberchanel.push(objectmember)
    }else{
      upadtememberchanel.forEach((element , i) => {
        if(element.member__id == presonid){
          upadtememberchanel[i] = objectmember;
          chekrpead = false;
        }
      })
      if(chekrpead){
        upadtememberchanel.push(objectmember)
      }
    }
  }else{
    upadtememberchanel = jQuery.grep(upadtememberchanel, function(value) {
      return value.member__id != presonid;
    });
  }
  
});
$('.users-list-chanel').on('click' ,'input', function(){
  let id = $(this).parents('li').attr('id');
    $(`li#${id}`).click();
});
$('.sellect_all-box input').on('click', function(){
  if ($('.users-list-chanel').children().length && $('.users-list-chanel').children()[0].className !== 'loadinglist') {
    selectAndUnsellect($(this) , '.users-list-chanel li' , 'edit');
  }else{
    $('.sellect_all-box input').prop('checked' , false)
  }
});
$('.info-member-chanel').on('click','li i.fa-user-shield', function(){
  let userId = $(this).parents('li').attr('class');
  let isadmin = $(this).parents('li').children('input').prop('checked');
  if(isadmin){
    isadmin = 0;
    update_member(userId ,isadmin)
  }else{
    isadmin = 1;
    update_member(userId ,isadmin)
  }
});
$('.header-update-chanel .fa-times-circle').on('click',function () {
    // $('.update-info').css({display:'none'});
    // $('.add-admin-chanel').css({display:'none'});
    // $('.add-usre-chanel').css({display:'none'});
    // $('.back-menu-list').css({display:'none'});
    // $('.update-chanel').css({display:'none'});
    // $('.update_info_chanel').css({display:'none'});
    // $('.info_chanel').css({display:'block'});
    // $('.sellect_all-box').css({display:'none'});
    // $('.update-name-chanel input').val('');
    // $('.area-box textarea').val('');
    // $('.update_enable_comments input').prop('checked' , true);
    // $('.users-list-chanel li').remove();
    // removeImgChanel(imgUpdateChanelUpload);
    // $(`.uploade-image-chanel img`).attr('src', './assets/images/blue.png');
    // $(`.uploade-image-chanel i.fa-camera`).show();
    if(stepLoationUpdate == 'subMenu'){
      $('.back-menu-list').trigger('click');
    }else if(stepLoationUpdate == 'update-chanel'){
      $('.back-to-info-chanel').trigger('click');
    }
});
$('.info-close').on('click',function(){
  $('.update_info_chanel').css({display:'none'});
});
$('.add-member-update-chanel').on('click',function(){
  let arr_member = JSON.stringify(upadtememberchanel)
  if (upadtememberchanel.length) {
    add_member(arr_member)
  }else{
    Swal.fire({
      icon: 'error',
      title: "عضوی برای افزودن به کانال انتخاب نشده",
      showConfirmButton: false,
      timer: 2000
    })
    
  }
  $('.users-list-chanel li').remove();
  member_channel('menu-admin')
  $('.sellect_all-box').css({display:'none'});
});
$('.info-member-chanel ').on('click','li i.fa-trash',function(){
  let deleteid = $(this).parents('li').attr('class');
  $(`li.${deleteid} i.fa-user-shield`).css({display:'none'});
  let timer = 5
    $(`li.${deleteid} i.fa-trash`).replaceWith(`
    <span>
      <p class = "give-up" style = "float: left;color: #fd4c4c; margin-right: 20px; cursor: pointer; font-weight: 500;">لغو حذف ${timer}</p>
    </span>
    `);
  timerint[deleteid] = setInterval (() =>{
    if (timer > 0) {
      $(`li.${deleteid} .give-up`).replaceWith(
        `
        <p class = "give-up animate__animated animate__heartBeat" style = "float: left;color: #fd4c4c; margin-right: 20px; cursor: pointer; font-weight: 500;">لغو حذف ${timer}</p>
        `
        );
        timer -= 1;
    }
    if (timer == 0) {
      clearInterval(timerint[deleteid]);
      deletemember(deleteid);
    }
    },1000);
    
});
$('.info-member-chanel ').on('click','li .give-up',function(){
  let deleteid = $(this).parents('li').attr('class');
  $(`li.${deleteid} i.fa-user-shield`).css({display:'block'});
  $(`li.${deleteid} span`).replaceWith(`<i class="fas fa-trash" style="float: left;color: #fd4c4c;;cursor: pointer; margin-right: 20px;"></i>`);
  clearInterval(timerint[deleteid]);
});
$('.member-seen-header .fa-times-circle').on('click' ,function(){
  $('div.member-seen').css({display: 'none'});
  $('.sellect_all-box').css({display:'none'});
});

let member_channel = (Location)=>{
  $.ajax({
    url: api_address + "/notices/get_list_member_channel",
    type: "post",
    data: {
      channel__id : chanel_id,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_member = res.data.list_member;
          addmembers = list_member;
          let out_member_chanel = ``
          let adminIcon = ``;
          let membericon =``;
          let adminCheck=``;
          let textmove = ''
          list_member.forEach(element => {
            if(element.user_type == 'personel'){
              membericon = `<i class="fas fa-user-tie user_i"></i>`;
            }else if (element.user_type == 'teacher'){
              membericon = `<i class="fas fa-chalkboard-teacher user_i"></i>`;
            }else if(element.user_type == 'student'){
              membericon = `<i class="fas fa-user-graduate user_i"></i>`;
            }else{
              membericon = ``;
            }
            if (element.is_admin == 1){
              adminCheck = 'checked'
              adminIcon = `<i class="fas fa-user-shield" style="color: green; cursor: pointer;"></i>`
            }else{
              adminCheck = ``
              adminIcon = `<i class="fas fa-user-shield" style="color: #c3c3c3; cursor: pointer;"></i>`
            }
            if(element.name_family.length >= 18){
              textmove = 'textmove'
            }else{
              textmove = ''
            }
            out_member_chanel += 
            `
            <li class="${element.user__id}">
              ${membericon}
              <div  class="member-name">
                <p class="${textmove}" >${element.name_family}</p>
              </div>
              <i class="fas fa-trash" style = "float: left;color: #fd4c4c;cursor: pointer; margin-right: 20px;"></i>
              <input type="checkbox" ${adminCheck}>
              ${adminIcon}
              <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              </hr>
            </li>
            `
          });
          $('.info-member-chanel').html(out_member_chanel);
          $('.chanel-member-cunt').html(`${list_member.length} نفر`);
          listChanel.list_channel.forEach(element =>{
            if(element.channel__id == chanel_id){
              $('.decription-text').html(element.description);
            }
          });
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
let update_info_channel = (name , description , image_channel , allow_comment)=>{
  $.ajax({
    url: api_address + "/notices/update_info_channel",
    type: "post",
    data: {
      channel__id : chanel_id,
      name : name,
      description : description,
      image_channel : image_channel,
      allow_comment : allow_comment,

  },
    beforeSend: function(request) {
        $('.save-change-info').prop('disabled', true);
        $('.save-change-info').html(
          `
            <div 
            class="spinner-border 
            text-dark" role="status" 
            style = 
            "
              position: inherit;
              display: inline-block; 
              width: 20px;
              height: 20px;
            "
            >
              <span class="sr-only">Loading...</span>
            </div>
        `
        );
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          Swal.fire({
            icon: 'success',
            title: 'اطلاعات کانال با موفقیت تغییر یافت',
            showConfirmButton: false,
            timer: 1500
          })
          $('.update-info').css({display:'none'});
          $('.add-admin-chanel').css({display:'none'});
          $('.add-usre-chanel').css({display:'none'});
          $('.back-menu-list').css({display:'none'});
          $('.update-chanel').css({display:'none'});
          $('.update_info_chanel').css({display:'none'});
          $('.info_chanel').css({display:'block'});
          $('.update-name-chanel input').val('');
          $('.area-box textarea').val('');
          $('.users-list-chanel li').remove();
          ChanleList();
          // $(`.sideBar #${chanel_id}`).trigger('click');
          removeImgChanel(imgUpdateChanelUpload);
          $(`.uploade-image-chanel img`).attr('src', './assets/images/blue.png');
          $(`.uploade-image-chanel i.fa-camera`).show();
          $('.save-change-info').prop('disabled', false);
          $('.save-change-info').html(`ذخیره`);
        }else{
          console.log(res);
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
    complete :function (data) {
      
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
let update_member = (userId , is_admin)=>{
  $.ajax({
    url: api_address + "/notices/update_member",
    type: "post",
    data: {
      channel__id : chanel_id,
      member__id : userId,
      is_admin : is_admin,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
        $(`.info-member-chanel li#${userId} .spinner-border`).css({display : 'block'});
        $(`.info-member-chanel li#${userId} i.fa-user-shield`).css({display : 'none'});
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          member_channel('menu-admin');
        }else{
          console.log(res);
          Swal.fire({
            icon: 'error',
            title: res.data.message,
            showConfirmButton: false,
            timer: 2000
          });
          $(`.info-member-chanel li#${userId} .spinner-border`).css({display : 'none'});
          $(`.info-member-chanel li#${userId} i.fa-user-shield`).css({display : 'block'});
        }
      }catch(err){
        console.log(err);
      }
    },
    complete :function (data) {
      
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
let add_member = (list) => {
  console.log(list);
  $.ajax({
    url: api_address + "/notices/add_member",
    type: "post",
    data: {
      channel__id : chanel_id,
      arr_member : list,
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
            title: "کاربران انتخاب شده به کانال اضافه شدند",
            showConfirmButton: false,
            timer: 2000
          })
        }else{
          console.log(res);
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
    complete :function (data) {
      
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
let deletemember = (id) => {
  $.ajax({
    url: api_address + "/notices/delete_member",
    type: "post",
    data: {
      channel__id : chanel_id,
      member__id : id,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          $(`li.${id} span`).replaceWith('<i class="fas fa-ban" style = "float: left;color: darkred; margin-right: 20px;"></i>');
          // clearInterval(timerint);
        }else{
          console.log(res);
          $(`li.${id} span`).replaceWith(`<i class="fas fa-trash" style="float: left;color: #fd4c4c;cursor: pointer; margin-right: 20px;"></i>`)
          $(`li.${id} i.fa-user-shield`).css({display:'block'});
          Swal.fire({
            icon: 'error',
            title: res.data.message,
            showConfirmButton: false,
            timer: 2000
          });
          // clearInterval(timerint);
        }
      }catch(err){
        console.log(err);
      }
    },
    complete :function (data) {
      
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
let list_receiver_news_channel = (id) => {
  $.ajax({
    url: api_address + "/notices/list_receiver_news_channel",
    type: "post",
    data: {
      news__id : id,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          let list_member = res.data.rows_receiver_news;
          let out_member_chanel = ``
          let personicon = ``;
          let seen =``;
          list_member.forEach(element => {
            if(element.type_user == 'personel'){
              personicon = `<i class="fas fa-user-tie"></i>`
            }else if(element.type_user == 'student'){
              personicon = `<i class="fas fa-chalkboard-teacher"></i>`
            }else if(element.type_user == 'teacher'){
              personicon = `<i class="fas fa-user-graduate"></i>`
            } 
            if(!(element.seen_time == '')){
              seen = `<i class="fas fa-eye" style ="color: blue;"></i>`
            }else{
              seen = `<i class="far fa-clock"></i>`
            }
              out_member_chanel += 
              `
              <li>
                ${personicon}
                <p>${element.f_name} ${element.l_name}</p>
                ${seen}
              </li>
              `
          });
          $('.member-list-seen').html(out_member_chanel);
        }else{
          console.log(res);
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
    complete :function (data) {
      
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}
let delete_channel = (id , message)=>{
  $.ajax({
    url: api_address + "/notices/delete_channel",
    type: "post",
    data: {
      channel__id : id,
  },
    beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(response) {
      try{
        let res = jQuery.parseJSON(response);
        if(res.result == 'ok'){
          message.fire({
            title: `کانال شما با موفقیت حذف شد`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          
          setTimeout(()=>{location.reload();}, 2000);
        }else{
          message.fire({
            title: res.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }catch(err){
        console.log(err);
      }
    },
    complete :function (data) {
      
    },
    cache : function(response) {
      console.log(response);
    },
    error:function(response){
      console.log(response);
    }
  });
}

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
      imgChanelUpload.settings.multipart_params["Session_id"] = session;
      imgUpdateChanelUpload.settings.multipart_params["Session_id"] = session;
    }
  })
};

if(session == ''){
  get_session_archive()
}