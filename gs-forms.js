class GSForms {
    constructor({loadingEl, log, callback}){
        this.formSelector = ".gs-form";
        this.formData = {};
        this.init();
        this.loadingEl = loadingEl;
        this.log = log == undefined ? false : log;
        this.callback = callback;
    }
    init = () =>{
        const forms = document.querySelectorAll(this.formSelector);

        forms.forEach(form => {
            form.onsubmit = (e) => {
                e.preventDefault();
                const btn = form.querySelector("button[type=submit]");
                console.log(btn);
                const innerText = btn.innerHTML;
                btn.innerHTML= this.loadingEl;
                if(form.checkValidity() === false && form.classList.contains("needs-validation")){
                    form.classList.add("was-validated")
                    btn.innerHTML = innerText;
                }else{
                    const action = form.getAttribute("action");

                    const data = new FormData(form);
                    console.log(data);
                    
                    console.log(form.checkValidity());
                    let alertClass = "alert-danger";

                    fetch(action, {
                        body: data,
                        method: "post"
                    }).then(e => {
                        //console log:
                            this.log && console.log(e);
                        //

                        btn.innerHTML = innerText;

                        if(e.ok){
                            // if request was successful
                            if(typeof this.callback != "undefined"){
                                this.callback();
                            }
                            alertClass = "alert-success";
                        }
                        return e.text();
                    }).then(txt => {
                        const alertBox = `<div class="alert ${alertClass} alert-dismissible fade show"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> ${txt} </div>`;

                        if(alertClass && txt){
                            form.querySelector(".messages")?.insertAdjacentHTML("beforeend", alertBox);
                            form.reset();
                        }
                    })
                    .catch(err => {
                        btn.innerHTML = innerText;
                        console.error(err);
                    })
                }

            }
        })

    }
}