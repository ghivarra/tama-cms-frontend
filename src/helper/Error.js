import Swal from 'sweetalert2';

export const swalError = function(data, fn) {

	Swal.fire({
		title: data.title, 
		text: data.message,
		icon: data.icon,
		allowOutsideClick: false,
		showCloseButton: false,
		confirmButtonText: data.confirmButtonText
    }).then(() => {
			if (typeof fn === 'function'){
				fn();
			}
		});
}