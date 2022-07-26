$(document).ready(function(){
  htmlobj=$.ajax({url:"/admin/mainPage/getMainIcon",async:false,
      success:function(data){
      // console.log(data);
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.src = 'data:image/jpg;base64,'+data.data;
        document.getElementsByTagName('head')[0].appendChild(link);
        console.log($("[rel='shortcut icon']").attr("src"));
      }
    });

});
