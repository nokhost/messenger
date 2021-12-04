const api_address = "http://t.atiehsazan.ir/new_school_prj/backend/api";
let token = "CF57AAA62AE3F9F053908918E7C70FCE";

// ************************* get_session_archive  ****************************
let session = '';
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
    }
  })
};
if(session == ''){
  get_session_archive()
}

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

$('.heading-refresh i').on('click',function () {
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

// ************************* conversation ****************************
let myuser_id = '';
let conversation = '';
let chanel_id = '';

$(".sideBar").on("click", ".sideBar-body", function(e) {
    $('.reply').css({"visibility":"inherit"})
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
          try{
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
                            let fileType = element.file_type;
                            if (fileType == 'pdf') {
                              show_file +=`<span class="viwe_box_item"><img class="archive_view_post" src="./assets/images/pdf.png" alt=""></img> <i id="${element.file__id}" class="fas fa-download"></i></span>`;
                            }else if (fileType == 'aac'|| fileType =='mp3' ){
                              show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/player_icon.png" alt=""></img> <i id="${element.file__id}" class="fas fa-cloud-download-alt audio_play"></i></span>`;
                            }else if (fileType == 'jpg' || fileType == 'jpeg'){
                              show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt=""></img> <i id="${element.file__id}" class="fas fa-download"></i></span>`;
                            }else{
                              show_file +=`<span class="viwe_box_item" ><img class="archive_view_post" src="./assets/images/document_icon.png" alt=""></img> <i id="${element.file__id}" class="fas fa-download"></i></span>`;
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
          }catch(err){
            console.log(err);
          }
        }
    });
});

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
// ************************* download file ****************************
$(window).on('click', function (e) {
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
          if(true){
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
  
});

// ************************* heading conversation ****************************
$('.heading-back').on('click', function() {
    $('.side').show();
});

$(".heading-refresh").on("click", function() {
    console.log('heading-refresh');
});

// ************************* conversation more option ****************************
$(".conversation").on('click', '.fa-copy', function() {
    console.log("conversation more option");
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
  
  if(!$(e.target).parents('.conversation').length){
      preview_file = '';
      $('.prv_file').css({ visibility: "hidden" });
      $.each(uploader.files, function (i, file) {
        uploader.removeFile(file);
      });
    }
});

// ************************* send message ****************************

let sendedfiles = (id  , name , size )=>{
  console.log('id--' ,id , 'name---',name ,'size----', size );
}
$('.reply-send i').on('click', function() {
  
  uploader.start();
  

  // if file || text is exist visibility => true
  // if (true){
  //   $('fa-send').css({ visibility: "inherit" });
  //   console.log('hi');
    

  // }
  // const swalWithBootstrapButtons = Swal.mixin({
  //   customClass: {
  //     confirmButton: 'btn btn-success',
  //     cancelButton: 'btn btn-danger'
  //   },
  //   buttonsStyling: false
  // })
  
  // swalWithBootstrapButtons.fire({
  //   title: 'Are you sure?',
  //   text: "You won't be able to revert this!",
  //   icon: 'warning',
  //   showCancelButton: true,
  //   confirmButtonText: 'Yes, delete it!',
  //   cancelButtonText: 'No, cancel!',
  //   reverseButtons: true
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     swalWithBootstrapButtons.fire(
  //       'Deleted!',
  //       'Your file has been deleted.',
  //       'success'
  //     )
  //   } else if (
  //     /* Read more about handling dismissals below */
  //     result.dismiss === Swal.DismissReason.cancel
  //   ) {
  //     swalWithBootstrapButtons.fire(
  //       'Cancelled',
  //       'Your imaginary file is safe :)',
  //       'error'
  //     )
  //   }
  // })
    // if (chanel_id) {
    //     $.ajax({
    //         url: api_address + "/notices/insert_news_channel",
    //         type: "post",
    //         data: {
    //             description: '',
    //             channel__id: chanel_id,
    //             list_archive: '',
    //             allow_comment: '',
    //             type: 'file'
    //         },
    //         beforeSend: function(request) {
    //             request.setRequestHeader("Authorization", "Bearer " + token);
    //         },
    //         success: function(response) {
    //             $(".sideBar").ready(function() {
    //                 let res = jQuery.parseJSON(response);
    //                 console.log(res);
    //                 let out = "";


    //             });
    //         },
    //     });
    // } else {}
})

// ************************* archive files ****************************
let preview_file = '';  
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
    if(uploader.files.length <= 6){
      plupload.each(files, function (file) {
        // sendedfiles(file.id , file.name , plupload.formatSize(file.size) , file.type)
        let type_file = '';
        let img = file.type.includes('image');
        let pdf = file.type.includes('pdf');
        let voice = file.type.includes('audio');
        let video = file.type.includes('video');
        if(img){
          type_file = ` <img src="./assets/images/img_icon.png" alt="${file.name}">`
        }else if(pdf){
          type_file = ` <img src="./assets/images/pdf.png" alt="${file.name}">`
        }else if(voice){
          type_file = ` <img src="./assets/images/player_icon.png" alt="${file.name}">`
        }else if(video){
          type_file = ` <img src="./assets/images/video_icon.png" alt="${file.name}">`
        }else{
          type_file = ` <img src="./assets/images/document_icon.png" alt="${file.name}">`
        }
        preview_file += `
          <span id = "${file.id}">
            ${type_file}
            <i class="fas fa-times"></i>
          </span>
      `;
      });
      $('.prv_file').html(preview_file);
      if ($('.prv_file').children().length){
        $('.prv_file').css({ visibility: "inherit" })
      }
    }else{
      Swal.fire({
        className: 'custom_sweet_alert_2',
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
      })
    }

  });
  uploader.bind('UploadProgress', function (up, file) {
    alert(file.percent)
    // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";

});
  uploader.bind('Error', function (up, err) {
      // document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
      console.log(err.message);
  });
  uploader.bind('FileUploaded', function (up, file, info) {
        try {
          let myresponse = $.parseJSON(info['response']);
          console.dir(myresponse);
          if (myresponse['Result'] === "Ok") {
              //console.log(myresponse['Data']['File_id']);
          } else {
              //console.log(myresponse['Data']['Message']);
          }
        } catch (ex) {
            alert(ex);
        }
    });
  uploader.bind('ChunkUploaded', function (up, file, info) {
    // console.dir(info);
  });
  uploader.bind('UploadComplete', function (up, file) {
    
  });

    
    if(session == ''){
      get_session_archive();
    }else{
      uploader.settings.multipart_params["Session_id"] = session;
    }

  $('.prv_file').on('click','.fa-times',function (e) {
    let clicked_file_id = $(e.target).parents('span')[0].id;
    $.each(uploader.files, function (i, file) {
      if (file && file.id == clicked_file_id) {
        // $('span').remove(`#${clicked_file_id}`);
        uploader.removeFile(file);
      }
    });
  });

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
                      let fileType = element.file_type;
                      if (fileType == 'pdf') {
                        show_file +=`<div class="viwe_box_item"><img class="archive_view_comment" src="./assets/images/pdf.png" alt=""></img> <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i></span>`;
                      }else if (fileType == 'aac'|| fileType =='mp3' ){
                        show_file +=` <audio controls>
                        <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" type="audio/ogg">
                        <source src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" type="audio/mpeg">
                      </audio>`;
                      }else if (fileType == 'jpg' || fileType == 'jpeg'){
                        show_file +=`<div class="archive_view_comment" ><img class="archive_view_comment" src="http://archive.atiehsazan.ir/Api/GetFile/?Session_id=${session}&File_id=${element.file__id}" alt=""></img><i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i></span>`;
                      }else{
                        show_file +=`<div class="archive_view_comment" ><img class="archive_view_comment" src="./assets/images/document_icon.png" alt=""></img> <i id="${element.file__id}" class="far fa-arrow-alt-circle-down"></i></span>`;
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