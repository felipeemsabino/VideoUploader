(function() {
	var module = angular.module('app-module',[]);
	
	/* Controller */
	module.controller('UploadController', UploadController);
	function UploadController() {
		var me = this;

		me.$onInit = function() { // on init set the ajax request parameters and callbacks
			var url = 'https://upload.wistia.com'; //upload server url
			$('#fileupload').fileupload({ //ajax call parameters
				url: url,
				contentType: false,
				cache: false,
				processData: false,
				success:function(data) {
					alert("The video was uploaded with success!");
					$('#progress .progress-bar').css( 'width', 0 + '%' ); //reset progress bar
					if($('#nextVideoId').val() == '_') { // first time
						me.addPlayerClass(data.hashed_id);
						me.playVideo(data.hashed_id);
					}
					$('#nextVideoId').val(data.hashed_id).trigger('change');
				},
				error: function(data) { 
					alert("Error trying to upload the video. Please, try again.");
					$('#progress .progress-bar').css( 'width', 0 + '%' ); //reset progress bar
					console.log('error '+data); 
				},
				progressall: function (e, data) { // progress bar update
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('#progress .progress-bar').css( 'width', progress + '%' );
				}
				
			}).on('fileuploadadd', function (e, data) { // when user pick the file, set api key parameter
				$('#fileupload').fileupload({ 
					formData: {api_password: '8bab0103d8ce545b84d6b76cdaa703facc01cdd8e19d61edd52b0d8d1f98b5f3'} // add the api parameter
				});
				
			}).on('fileuploaddone', function (e, data) { // after upload with success
			}).on('fileuploadfail', function (e, data) { // after upload with error
			}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
		};
		
		me.addPlayerClass = function (videoId) {
			var newClass = 'wistia_async_' + videoId;
			$(".wistia_embed").addClass(newClass);
		};
		
		me.playVideo = function (videoId) {
			window._wq = window._wq || [];
						
			_wq.push({ id: videoId, onReady: function(video) {				
				
				$("#nextVideoId").change(function() {
					console.log('mudou');
					video.replaceWith($('#nextVideoId').val());
				});
				
			}});
		};
		
		// Methods to check the extension in a real case.
		function getExtension(filename) {
			var parts = filename.split('.');
			return parts[parts.length - 1];
		}
		
		function isVideo (filename) {
			var ext = getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'mkv':
			case 'webm':
			case 'flv':
			case 'vob':
			case 'm4v':
			case 'avi':
			case 'mpg':
			case 'mp4':
			case 'asf':
			case 'mov':
			case 'avchd':
			case 'divx':
			
				return true;
			}
			return false;
		}
	}

	/* Component */
	module.component('uploadVideo', {
	  templateUrl: 'uploader-template.html',
	  controller: 'UploadController as vm',
	});
})();