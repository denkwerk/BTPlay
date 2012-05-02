// docs at http://www.flickr.com/services/api/flickr.photos.search.html
Flickr = {
	apiKey: "d86848d57cb3f7ad94f2ee9a3c90eff1",
	format: function(string, object) {
		return string.replace(/\$\{(.+?)\}/g, function(match, key) { return object[key]; });
	},
	search: function(term, callback) {
		$.ajax({
			url: "http://api.flickr.com/services/rest/",
			dataType: "jsonp",
			jsonpCallback: "jsonFlickrApi",
			data: {
				format: "json",
				api_key: Flickr.apiKey,
				method: "flickr.photos.search",
				safe_search: 1,
				text: term,
				per_page: 10,
				page: 1
			},
			success: function( data ) {
				var result = $.map( data.photos.photo, function( photo ) {
					return {
						title: photo.title,
						src: Flickr.format("http://farm${farm}.static.flickr.com/${server}/${id}_${secret}_m.jpg", photo),
						href: Flickr.format("http://www.flickr.com/photos/${owner}/${id}/", photo)
					};
				});
				callback( result, data.photos.total );
			}
		});
	}
};
