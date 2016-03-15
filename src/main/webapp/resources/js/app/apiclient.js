var fetchApolloData = function(apiUrl, ownerId, successHandler, errorHandler) {
    var url = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl + "&ownerId=" + ownerId;
    $.ajax({
        url: url,
        type: 'GET',
        accept: 'application/json',
        contentType: 'application/json',
        success: function (data) {
            if (successHandler) {
                successHandler(data);
            }
        },
        error: function (data, status, errorThrown) {
            if (errorHandler) {
                errorHandler(data, status, errorThrown);
            } else {
                console.log(errorThrown);
            }
        }
    });
}

//var fetchPartnerData = function(url) 