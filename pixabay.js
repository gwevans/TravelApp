/*******************************
*    PIXABAY API CALL        *
*******************************/
// function callPixabay(searchTerm) {

  var ajaxModule = function(){};
  ajaxModule.prototype = {
    iterator: 1,
    masonryTimeoutClear: "",

    init: function(request, callback) {
      var self = this;

      self.iterator++;

      request = encodeURIComponent(request.trim());
      this.callAjax(request, callback);

      $(".wrapper").html("").hide();
    },

    callAjax: function(request, callback) {
      var self = this;

      var ajaxRequest = $.ajax({
        url: "https://pixabay.com/api/?username=mjweaver01&key=1631539-db8210cabd2636c6df59812df&q=" + request + "&image_type=photo",
        success: function(response) {
          self.parseResponse(response);
        },
        error: function(response) {
          console.log(response);
        }
      })

      ajaxRequest.then(function() {
        if(callback) {
          callback();
        }
      })
    },

    parseResponse: function(response) {
      var self = this;

      //console.log(response.hits);
      $.each(response.hits, function(index, value) {
        $(".wrapper").prepend("<div class='image image" + index + "' style='width:" + value.webformatWidth + "px; height:" + value.webformatHeight + "px; background: url(" + value.webformatURL + ");'><a href='" + value.pageURL + "' target='_blank'><div class='overlay'></div></a><div class='hidden'></div></div>");
        $(".image"+index+" .hidden").append("<div>User: <b>" + value.user + "</b></div><div>Tags: <b>" + value.tags + "</b></div><div class='stats'><i class='fa fa-eye'></i> <b>" + value.views + "</b> &nbsp; <i class='fa fa-thumbs-o-up'></i> <b>" + value.likes + "</b></div><div class='direct-links'><a href='" + value.webformatURL + "' target='_blank'><i class='fa fa-link'></i>  Direct Link</a> <a href='" + value.webformatURL + "' download><i class='fa fa-download'></i> Download</a></div>");
      });

      clearTimeout(self.masonryTimeoutClear);
      self.masonryTimeoutClear = setTimeout(self.runMasonry, 500);
    },

    runMasonry: function() {
      //destroy and then rebuild it
      if($(".wrapper").masonry().length > -1) {
        $(".wrapper").masonry("destroy");
      }

      $(".wrapper").masonry({
        itemSelector: '.image',
        isFitWidth: true,
        gutter: 0
      });

      $(".wrapper").show();
    }
  }

  //----------------------------------

  var newModule = new ajaxModule();


  var timeoutClear;
  $("#searchTerm").keyup(function() {
    var keyword = $(this).val().toLowerCase();

    clearTimeout(timeoutClear);
    timeoutClear = setTimeout(function() {

      if(keyword || !keyword === "undefined") {
        newModule.init(keyword);
      }
    },1000);
  });

// }