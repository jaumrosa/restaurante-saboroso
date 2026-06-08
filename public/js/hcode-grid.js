class HcodeGrid {
    constructor(configs){
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

    initButtons(){
        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {
            btn.addEventListener('click', e => {
                let tr = e.target.closest('tr');
                let data = JSON.parse(tr.dataset.row);
                
                if(confirm(eval('`' + this.options.deleteMsg + '`'))) {
                    fetch(eval('`' + this.options.deleteUrl + '`'), {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json.success) {
                                window.location.reload();
                            } else {
                                alert('❌ ' + (json.error || 'Erro ao excluir'));
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert('❌ Erro ao excluir');
                        });
                }
            });
        });

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {
            btn.addEventListener('click', e => {
                let tr = e.target.closest('tr');
                let data = JSON.parse(tr.dataset.row);
                
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

                $('#modal-update').modal('show');
            });
        });
    }
}
