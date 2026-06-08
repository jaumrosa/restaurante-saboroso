HTMLFormElement.prototype.save = function() {
    const form = this;
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                window.location.reload();
            } else {
                alert(json.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Erro ao processar requisição, verifique no console');
        });
    });
};
