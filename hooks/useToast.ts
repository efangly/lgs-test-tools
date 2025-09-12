import Swal from 'sweetalert2';

export const useToast = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const showSuccess = (title: string) => {
    Toast.fire({
      icon: "success",
      title
    });
  };

  const showError = (title: string) => {
    Toast.fire({
      icon: "error",
      title
    });
  };

  const showInfo = (title: string) => {
    Toast.fire({
      icon: "info",
      title
    });
  };

  return {
    showSuccess,
    showError,
    showInfo
  };
};
