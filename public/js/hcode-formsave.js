HTMLFormElement.prototype.save = function (){
    const form = this;
    return new Promise((resolve, reject) => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formCreateData = new FormData(formCreate);
            
            fetch(form.action, {
                method: form.method,
                body: formCreateData
            })
            .then(response => response.json())
            .then(json => {
                resolve(json);
            })
            .catch(err => {
                reject(err);
            });
        });
    })
    
}