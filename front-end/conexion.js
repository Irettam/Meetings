$.ajaxSetup({ cache: false });

var $Conexion = (function() {

	function _server(controller, action, param, user) { //Tiene por prototipo a/hereda de : Object

		var self = this;

		self.controller = controller || undefined;
		self.action = action || undefined;
		self.param = param || undefined;
		self.user = user || undefined;
		self.Success = function(obj) {
			console.log(obj);
		};
		self.Redirect = function(obj) {
			console.log(obj);
		};
		self.Error = function(obj) {
			obj.Messages.forEach(function(msg) {
				console.log(msg.Message);
			})
		};
		self.Execute = function(resolve, reject) {
			var user = new Object();
			//user.getLocalStorage();
			if (user.id != null) {
				self.user = user;
			} else {
				self.user = undefined;
			}
			return $.ajax({
				type: "GET",
				url: "http://localhost:31093/HelloWorldApplication/webresources/Conexion/" + JSON.stringify(self),
				//contentType: "application/json",
				//data: JSON.stringify(self),
				success: function(response) {
					if (response.redirect) {
						self.Redirect(response);
						window.location.href = response.redirect;
					} else {
						if (response.ResultSet) {
							self.Success(response.ResultSet, resolve);
						} else {
							self.Error({
								Messages: [{
									Message: "Sin resultados"
								}]
							});
						}
					}
				},
				error: function(response) {
					self.Error(response.responseJSON, reject);
				}
			})
		}

	}


	return {
		Server: _server
	}

})();