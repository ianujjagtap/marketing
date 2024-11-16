jQuery(document).ready(() => {
	jQuery("#contact-form").on("submit", function (e) {
		e.preventDefault();

		const formId = jQuery(this).attr("id");
		const successMessage = "Your request has been submitted successfully.";

		jQuery.ajax({
			url: "form-handler.php",
			data: jQuery(this).serialize(),
			type: "POST",
			success: (response) => {
				const data = JSON.parse(response);
				if (data.status === "success") {
					swal({
						title: "Thank You!",
						text: successMessage,
						icon: "success",
						timer: 3000,
					}).then(() => {
						jQuery(`#${formId}`)[0].reset();
					});
				} else {
					swal({
						title: "Oops...",
						text: data.message || "Something went wrong :(",
						icon: "error",
						timer: 3000,
					});
				}
			},
			error: (xhr, status, error) => {
				console.error("Error: ", error, xhr.responseText);
				swal({
					title: "Oops...",
					text: "Something went wrong :(",
					icon: "error",
					timer: 3000,
				});
			},
		});
	});
});
