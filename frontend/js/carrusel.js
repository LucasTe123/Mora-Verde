document.addEventListener('DOMContentLoaded', async () => {
  const slides = await getCarrusel();

  if (slides && slides.length > 0) {
    const formatted = slides.map(s => ({
      image: s.imagen,  // ✅ ya es URL directa

      title: '',
      subtitle: '',
      btnText: '',
    }));
    initCarousel(formatted);
  } else {
    initCarousel([
      { title: '', subtitle: '', btnText: '', bg: '#2d5a3d' },
      { title: '', subtitle: '', btnText: '', bg: '#3d6b50' },
      { title: '', subtitle: '', btnText: '', bg: '#4a7c59' },
    ]);
  }
});