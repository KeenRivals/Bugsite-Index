// Google Analytics.
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-92420390-1', 'auto');
ga('send', 'pageview');
// End of Google Analytics.


var $uploadForm = $('#online-checker');
var $toUpload = null;
var $data = null;

$('.upload-dragndrop').on('click', function(e) {
  $('.upload-file').click();
});

$('.upload-file').on('change', function(e) {
  $toUpload = e.target;
  if($toUpload) {
    $uploadForm.trigger('submit');
  }
});

$('.reset-upload').on('click', function(e) {
  $toUpload = null;
  $('.upload-select').removeClass('hide');
  $('.upload-inprogress').addClass('hide');
  $('.upload-error').addClass('hide');
  $('.upload-success').addClass('hide');
  $('.reset-upload').addClass('hide');
});

$uploadForm.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $uploadForm.addClass('upload-dragover');
  })
  .on('dragleave dragend drop', function() {
    $uploadForm.removeClass('upload-dragover');
  })
  .on('drop', function(e) {
    $toUpload = e.originalEvent.dataTransfer;
    $uploadForm.trigger('submit');
  })
  .on('submit', function(e) {
    if ($uploadForm.hasClass('upload-inprogress')) return false;
    // Update UI.
    $('.upload-select').addClass('hide');
    $('.upload-inprogress').removeClass('hide');
    $('.upload-error').addClass('hide');
    $('.upload-success').addClass('hide');
    $('.upload-success').html('');
    $('.reset-upload').addClass('hide');
    $(".progress-bar").width("0%");
    // Prepare submission.
    e.preventDefault();
    var formData = new FormData();
    if($toUpload.files.length) {
      $.each($toUpload.files, function(i, file) {
        ga('send', {
          hitType: 'event',
          eventCategory: 'File',
          eventAction: 'Upload',
          eventLabel: 'custom'
        });
        formData.append(file.name, file);
      });
    } else {
      formData.append('in-page-drag', $toUpload.getData('text/html'));
        ga('send', {
          hitType: 'event',
          eventCategory: 'File',
          eventAction: 'Upload',
          eventLabel: 'sample'
        });
    }
    $.ajax({
        url: '/sample/submit',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function(evt) {
                    var percent = (evt.loaded / evt.total) * 100;
                    $(".progress-bar").width(percent + "%");
                }, false);
            }
            return xhr;
        },
        success: function(data) {
            $('.upload-select').addClass('hide');
            $('.upload-inprogress').addClass('hide');
            $('.upload-error').addClass('hide');
            $('.upload-success').removeClass('hide');
            $('.reset-upload').removeClass('hide');
            $toUpload = null;
            var safeFilesCount = 0;
            var unsafeFilesCount = 0;
            var errorFilesCount = 0;
            $.each(data, function(filename, result) {
              if(result.error) {
                errorFilesCount += 1;
              } else if(result.has_collision) {
                unsafeFilesCount += 1;
                var element = $('<p></p>').addClass('text-danger')
                      .text('Collision found in ');
                element.append($('<b></b>').text(filename));
                $('.upload-success').append(element);
              } else {
                safeFilesCount += 1;
              }
            });
            if(safeFilesCount > 0 && unsafeFilesCount == 0) {
                $('.upload-success').append(
                  $('<p></p>').addClass('text-success')
                      .text('All the ' + safeFilesCount + ' uploaded files are safe.'));
            } else if (safeFilesCount > 0) {
                $('.upload-success').append(
                  $('<p></p>').addClass('text-success')
                      .text('All the remaining ' + safeFilesCount + ' files are safe.'));

            }
            if(errorFilesCount) {
              $('.upload-success').append(
                  $('<p></p>').addClass('text-danger')
                  .text('Could not process ' + errorFilesCount + ' files.'));
            }

        },
        error: function(data) {
            $toUpload = null;
            $('.upload-select').addClass('hide');
            $('.upload-inprogress').addClass('hide');
            $('.upload-error').removeClass('hide');
            $('.upload-success').addClass('hide');
            $('.reset-upload').removeClass('hide');
        }},
        'json');
  });

