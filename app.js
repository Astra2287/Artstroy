'use strict';
const serviceData={
 welding:{title:'Сварочные работы',description:'Сварка трубопроводов и металлических конструкций по требованиям вашего проекта.',items:['Сварка стыков трубопроводов','Сварка и сборка металлических конструкций','Согласование объёма и условий выполнения','Оформление предусмотренной договором документации']},
 cleaning:{title:'Абразивоструйная очистка',description:'Подготовка металлической поверхности перед нанесением антикоррозионного покрытия.',items:['Очистка сварных стыков и участков трубопроводов','Удаление ржавчины, окалины и старого покрытия','Подготовка поверхности под выбранную систему защиты','Требования к степени очистки определяются проектом']},
 protection:{title:'Антикоррозионная изоляция',description:'Защита сварных стыков трубопроводов от воздействия внешней среды.',items:['Подготовка зоны сварного соединения','Нанесение изоляционной системы по проекту','Сопряжение с основным покрытием трубопровода','Проверка и оформление результатов по условиям договора']}
};
const companyText='ТОО «АРТСТРОЙ-25»\nБИН: 250740027929\nЮридический адрес: Республика Казахстан, 060000, г. Атырау, сельский округ Кайыршакты, с. Томарлы, ул. Байдолла Ешмухамбетов, д. 11\nДиректор: Габдулов Орингали Жумажанович\nТелефон: +7 (701) 362-34-12\nПроизводственная база: Мангистауская область, с. Шетпе, мкр. Курылысшы, строение 19\nЛицензия на строительно-монтажные работы № 25028806 от 11.08.2025, III категория.';
const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.getElementById('mobile-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');mobileNav.hidden=true;}
menuButton.addEventListener('click',()=>{const isOpen=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!isOpen));menuButton.setAttribute('aria-label',isOpen?'Открыть меню':'Закрыть меню');mobileNav.hidden=isOpen;});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.addEventListener('resize',()=>{if(window.innerWidth>850)closeMenu();});
const serviceDialog=document.getElementById('service-dialog');
const requestDialog=document.getElementById('request-dialog');
let currentService='welding';
function openDialog(dialog){closeMenu();dialog.showModal();document.body.classList.add('modal-open');}
for(const dialog of document.querySelectorAll('dialog')){
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
}
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
 currentService=button.dataset.service;
 const data=serviceData[currentService];
 document.getElementById('service-dialog-title').textContent=data.title;
 document.getElementById('service-dialog-description').textContent=data.description;
 const list=document.getElementById('service-dialog-list');list.replaceChildren(...data.items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 openDialog(serviceDialog);
}));
function showRequest(selectedService){
 if(serviceDialog.open)serviceDialog.close();
 if(selectedService){document.querySelector(`input[name="service"][value="${selectedService}"]`).checked=true;}
 document.getElementById('request-form').hidden=false;
 document.getElementById('request-form').style.display='flex';
 document.getElementById('request-result').hidden=true;
 document.getElementById('form-error').hidden=true;
 openDialog(requestDialog);
}
document.querySelectorAll('[data-open-request]').forEach(button=>button.addEventListener('click',()=>showRequest()));
document.getElementById('request-service').addEventListener('click',()=>showRequest(currentService));
let requestText='';
document.getElementById('request-form').addEventListener('submit',event=>{
 event.preventDefault();
 const form=event.currentTarget;
 const data=new FormData(form);
 const selected=data.getAll('service');
 const error=document.getElementById('form-error');
 if(!selected.length){error.hidden=false;document.querySelector('input[name="service"]').focus();return;}
 error.hidden=true;
 const clean=name=>String(data.get(name)||'').trim();
 const customer=clean('customer'),location=clean('location'),diameter=clean('diameter'),volume=clean('volume'),details=clean('details');
 const lines=['ЗАПРОС НА РАСЧЁТ СТОИМОСТИ РАБОТ','Для ТОО «АРТСТРОЙ-25»','',customer?`Заказчик: ${customer}`:'',`Объект / местоположение: ${location}`,'','Виды работ:',...selected.map(key=>'— '+serviceData[key].title),'',diameter?`Диаметр трубопровода: ${diameter} мм`:'',volume?`Объём работ: ${volume}`:'',details?'\nДополнительные сведения:\n'+details:'','\nПросим уточнить стоимость, сроки и условия выполнения работ.'];
 requestText=lines.join('\n').replace(/\n{3,}/g,'\n\n').trim();
 document.getElementById('request-preview').textContent=requestText;
 form.hidden=true;form.style.display='none';
 document.getElementById('request-result').hidden=false;
 requestDialog.scrollTop=0;
 document.getElementById('copy-request').focus();
});
document.getElementById('edit-request').addEventListener('click',()=>{document.getElementById('request-result').hidden=true;const form=document.getElementById('request-form');form.hidden=false;form.style.display='flex';document.querySelector('input[name="location"]').focus();});
let toastTimer;
function toast(message){const element=document.getElementById('toast');element.textContent=message;element.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('visible'),3200);}
async function copyText(value){
 try{await navigator.clipboard.writeText(value);toast('Скопировано в буфер обмена');}
 catch(error){const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.opacity='0';(document.querySelector('dialog[open]')||document.body).append(field);field.select();const ok=document.execCommand('copy');field.remove();toast(ok?'Скопировано в буфер обмена':'Не удалось скопировать. Выделите текст вручную.');}
}
document.querySelector('.copy-company').addEventListener('click',()=>copyText(companyText));
document.getElementById('copy-request').addEventListener('click',()=>copyText(requestText));
document.getElementById('download-request').addEventListener('click',()=>{if(!requestText)return;const blob=new Blob(['\ufeff'+requestText],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='ARTSTROY-25_project-request.txt';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Файл запроса подготовлен');});
document.getElementById('year').textContent=String(new Date().getFullYear());
