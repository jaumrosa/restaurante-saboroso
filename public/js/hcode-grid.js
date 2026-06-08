class HcodeGrid {
    constructor(configs){
        configs.listeners = Object.assign({
            afterUpdateClick: (e) => {
                $('#modal-update').modal('show');
            },
            afterDeleteClick: (e) => {
                window.location.reload();  
            }
        }, configs.listeners);

        this.options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete'
        }, configs);
        
        this.initForms();
        this.initButtons();
    }

    initForms(){
        this.formCreateEl = document.querySelector(this.options.formCreate); 
        this.formCreateEl.save();

        this.formUpdateEl = document.querySelector(this.options.formUpdate);
        this.formUpdateEl.save();
    }

    fireEvent(name, args){
        if (typeof this.options.listeners[name] === 'function') {
            this.options.listeners[name].apply(this, args);
        }
    }

    getTrData(e){
        const tr = e.target.closest('tr');
        return JSON.parse(tr.dataset.row);
    }

    initButtons(){
        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {
            btn.addEventListener('click', e => {
                
                const data = this.getTrData(e);
                
                if(confirm(eval('`' + this.options.deleteMsg + '`'))) {
                    fetch(eval('`' + this.options.deleteUrl + '`'), {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json.success) {
                                this.fireEvent('afterDeleteClick');
                            } else {
                                alert(json.error);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert('Erro ao excluir');
                        });
                }
            });
        });

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {
            btn.addEventListener('click', e => {

                const data = this.getTrData(e);
                
                for (let name in data) {
                    let input = this.formUpdateEl.querySelector(`[name=${name}]`);
                    switch (name) {
                        case 'date':
                            if (input) input.value = moment(data[name]).format('YYYY-MM-DD');
                            break;
                        default:
                            if (input) input.value = data[name];
                    }
                }
                this.fireEvent('afterUpdateClick', [e]);
            });
        });
    }
}
