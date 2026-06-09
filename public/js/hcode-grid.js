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
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data) => {
                const input = form.querySelector('[name=' + name + ']');
                if (input) {
                    input.value = data[name];
                }
            }
        }, configs);

        this.rows = [...document.querySelectorAll('table tbody tr')];
        
        this.initForms();
        this.initButtons();
    }

    initForms(){
        this.formCreateEl = document.querySelector(this.options.formCreate); 
        if(this.formCreateEl){
            this.formCreateEl.save();
        }
        
        this.formUpdateEl = document.querySelector(this.options.formUpdate);
        if(this.formUpdateEl){
            this.formUpdateEl.save();
        }
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

    btnUpdateClick(e){
        const data = this.getTrData(e);    
        for (let name in data) {
            this.options.onUpdateLoad(this.formUpdateEl, name, data);
        }
        this.fireEvent('afterUpdateClick', [e]);
    }

    btnDeleteClick(e){
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
    }

    initButtons(){

        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click', e => {
                    if (e.target.classList.contains(this.options.btnUpdate)) {
                        this.btnUpdateClick(e);
                    } else if (e.target.classList.contains(this.options.btnDelete)) {
                        this.btnDeleteClick(e);
                    } else {
                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e])
                    }
                });
            });
        });
    }
}
