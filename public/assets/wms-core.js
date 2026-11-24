function Dt(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function gt(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let e=Number(t),n=Math.abs(e),a=e<0?"-":"",s=e.toLocaleString("vi-VN")+" \u20AB";if(n>=1e9){let i=(n/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:a+i,unit:"t\u1EF7 \u20AB",full:s}}else if(n>=1e6){let i=(n/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:a+i,unit:"tr \u20AB",full:s}}else return{val:a+n.toLocaleString("vi-VN"),unit:"\u20AB",full:s}}function Ge(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let e=new Date(t);if(isNaN(e.getTime()))return String(t);let n=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${n}-${a}-${s}`}catch{return String(t)}}function Wt(t,e=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:e})}function u(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Ye(t,e=200){let n=null;return function(...a){n&&clearTimeout(n),n=setTimeout(()=>{t.apply(this,a)},e)}}var mt=class{cache=new Map;defaultTtl=3e4;async get(e,n=this.defaultTtl){let a=Date.now(),s=this.cache.get(e);if(s&&a-s.timestamp<n)return a-s.timestamp>1e4&&fetch(e).then(i=>i.json()).then(i=>{i.success&&this.cache.set(e,{timestamp:Date.now(),data:i})}).catch(()=>{}),s.data;try{let r=await(await fetch(e)).json();return r.success&&this.cache.set(e,{timestamp:a,data:r}),r}catch(i){return{success:!1,error:i instanceof Error?i.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(e,n){this.cache.clear();try{return await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}catch(a){return{success:!1,error:a instanceof Error?a.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(e){if(!e){this.cache.clear();return}for(let n of this.cache.keys())n.includes(e)&&this.cache.delete(n)}async getPoList(e,n="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(n)}`)}async getPoDetails(e){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}`)}async getReceiptHistory(e){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(e)}`)}async getInventory(e){return this.get(`/api/wh/inventory?site=${encodeURIComponent(e)}`)}async submitManualReceipt(e){return this.post("/api/fnb/manual-receipt",e)}},Je=new mt;function _(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let e=window,n=typeof e.App<"u"&&e.App.currentBranch?e.App.currentBranch.toUpperCase():"K001";return n==="ALL"||!n?"K001":n}function A(t){if(!t||t==="\u2014")return"\u2014";let e=String(t).trim(),n=e.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;try{let a=new Date(e);if(!isNaN(a.getTime())){let s=a.getFullYear(),i=String(a.getMonth()+1).padStart(2,"0"),r=String(a.getDate()).padStart(2,"0");return`${s}-${i}-${r}`}}catch{}return e.slice(0,10)}function I(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let e=new Date;e.setHours(0,0,0,0);let n=new Date(t);n.setHours(0,0,0,0);let a=Math.ceil((n.getTime()-e.getTime())/(1e3*60*60*24));return a<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(a)} ng\xE0y)</span>`:a===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':a<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${a} ng\xE0y)</span>`:a<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${a} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${a} ng\xE0y</span>`}function O(t){window.gFnbReceiptCurrentView=t;let e=document.getElementById("fnbReceiptTabBtnPo"),n=document.getElementById("fnbReceiptTabBtnHistory"),a=document.getElementById("fnbPoListView"),s=document.getElementById("fnbReceiptHistoryView");t==="po"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),s&&s.classList.add("hidden"),P()):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),e&&(e.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),s&&s.classList.remove("hidden"),a&&a.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function At(t){let e=t||_(),n=document.getElementById("fnbReceiptFilterSite");n&&(n.value=e);let s=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(o=>o.code.toUpperCase()===e.toUpperCase()),i=s?s.ten||s.name:e,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=i),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(e):await P(e)}function Pt(t){et(t)}async function P(t){let e=t||_(),n=document.getElementById("fnbPoStatusFilter"),a=n?n.value:"OPEN",s=document.getElementById("fnbPoSummaryText");try{s&&(s.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${e}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(a)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let o=document.getElementById("fnbPoSearchInput")?.value||"";et(o);let l=(window.gFnbPoList||[]).filter(p=>p.status==="OPEN").length,d=document.getElementById("fnbReceiptBadgePendingCount");d&&(d.textContent=String(l))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(i){console.error("loadFnbPoList error:",i),s&&(s.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+i.message)}}function et(t=""){let e=document.getElementById("fnbPoTableBody"),n=document.getElementById("fnbPoMobileCards"),a=document.getElementById("fnbPoSummaryText"),s=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),i=(t||"").toLowerCase().trim(),r=window.gFnbPoList||[];s&&(r=r.filter(o=>{let l=(o.supplier_name||"").toLowerCase();return s==="siba"?l.includes("siba")||l.includes("b\u1EBFp trung t\xE2m")||l.includes("trung t\xE2m"):s==="baf"?l.includes("baf")||l.includes("th\u1ECBt"):s==="spice"?l.includes("gia v\u1ECB")||l.includes("\u0111\u01B0\u1EDDng")||l.includes("unilever")||l.includes("cholimex")||l.includes("mu\u1ED1i"):s==="veg"?l.includes("rau")||l.includes("\u0111\xE0 l\u1EA1t")||l.includes("c\u1EE7"):!0})),i&&(r=r.filter(o=>{let l=(o.po_number||"").toLowerCase(),d=(o.supplier_name||"").toLowerCase(),p=(o.supplier_code||"").toLowerCase();return l.includes(i)||d.includes(i)||p.includes(i)})),a&&(a.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),e&&(r.length===0?e.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':e.innerHTML=r.map(o=>{let l=o.status==="OPEN",d=o.status==="COMPLETED",p=d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',g=(o.po_number||"").startsWith("50000")||!o.supplier_code||o.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',f=Number(o.total_amount)||0,h=Number(o.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${u(o.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${u(A(o.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${g}
                <span class="font-medium text-gray-900 dark:text-white">${u(o.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${o.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${u(o.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${o.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${h.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${f>0?Math.round(f).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${p}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${u(o.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${d?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${d?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),n&&(r.length===0?n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':n.innerHTML=r.map(o=>{let l=o.status==="COMPLETED",d=(o.po_number||"").startsWith("50000")||!o.supplier_code||o.supplier_name==="B\u1EBFp Trung T\xE2m Siba",p=Number(o.total_amount)||0,m=Number(o.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${d?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${d?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${u(o.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${u(o.po_number)} \u2022 ${u(A(o.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${l?"text-emerald-600":"text-amber-600"} block">${l?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${o.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${m.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${p>0?Math.round(p).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${u(o.po_number)}')" class="w-full py-2 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${l?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${l?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function bt(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let n=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let a=n.data;if(!a.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let s=a[0],i=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),o=document.getElementById("receiptModalSite"),l=document.getElementById("receiptModalSiteDisplay"),d=document.getElementById("receiptModalSupplier"),p=document.getElementById("receiptModalSupplierDisplay"),m=document.getElementById("receiptModalDate"),g=new Date().toISOString().slice(0,10);i&&(i.value=s.po_number),r&&(r.textContent=s.po_number),o&&(o.value=s.site),l&&(l.textContent=s.site),d&&(d.value=s.supplier_name),p&&(p.textContent=s.supplier_name),m&&(m.value=g);let f="L\xD4-"+g.replace(/-/g,"").slice(2),h=new Date;h.setFullYear(h.getFullYear()+1);let c=h.toISOString().slice(0,10);window.gReceiptLines=a.map(b=>{let x=(b.merch_category||"").toLowerCase(),k=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:b.po_item,item_code:b.item_code,item_name:b.item_name,merch_category:b.merch_category,unit:b.unit||"KG",unit_price:Number(b.unit_price)||0,order_qty:Number(b.order_qty)||0,actual_qty:Number(b.order_qty)||0,batch_code:f,exp_date:k?c:"",is_food:k,note:""}}),ft();let y=document.getElementById("createReceiptModal");y&&y.classList.remove("hidden")}catch(e){console.error("openPoReceiptModal error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ft(){let t=document.getElementById("receiptLinesTableBody"),e=document.getElementById("receiptLinesMobileCards"),n=document.getElementById("receiptModalLineCount"),a=document.getElementById("receiptModalTotalAmount"),s=window.gReceiptLines||[];n&&(n.textContent=String(s.length));let i=0;t&&(t.innerHTML=s.map((r,o)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return i+=l,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${o+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${u(r.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${u(r.item_code)}</span>
              ${r.merch_category?`<span>\u2022</span><span>${u(r.merch_category)}</span>`:""}
              ${r.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${u(r.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(r.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${o}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${u(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${o}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${o}" value="${r.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${o}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${o}" class="mt-1">
                ${I(r.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${o}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${l>0?Math.round(l).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${u(r.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${o}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=s.map((r,o)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${u(r.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${u(r.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${u(r.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${o+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(r.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${o}" class="num font-bold text-brand-600 dark:text-brand-400">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${r.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${o}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${u(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${o}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${o}" value="${r.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${o}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${o}" class="mt-1">
                ${I(r.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${u(r.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${o}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),a&&(a.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Vt(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let n=parseFloat(e);window.gReceiptLines[t].actual_qty=isNaN(n)?0:n;let a=window.gReceiptLines[t],s=(a.actual_qty||0)*(a.unit_price||0),i=document.getElementById(`receiptLineTotal_${t}`);i&&(i.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${t}`);r&&(r.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let o=0;window.gReceiptLines.forEach(d=>{o+=(d.actual_qty||0)*(d.unit_price||0)});let l=document.getElementById("receiptModalTotalAmount");l&&(l.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function jt(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=e)}function qt(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=e;let n=document.getElementById(`receiptExpWarning_${t}`);n&&(n.innerHTML=I(e));let a=document.getElementById(`receiptExpWarningMob_${t}`);a&&(a.innerHTML=I(e)),window.lucide&&window.lucide.createIcons()}function Ot(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let n=new Date;n.setMonth(n.getMonth()+e);let a=n.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=a;let s=document.getElementById(`receiptLineExpInput_${t}`);s&&(s.value=a);let i=document.getElementById(`receiptLineExpInputMob_${t}`);i&&(i.value=a);let r=document.getElementById(`receiptExpWarning_${t}`);r&&(r.innerHTML=I(a));let o=document.getElementById(`receiptExpWarningMob_${t}`);o&&(o.innerHTML=I(a)),window.lucide&&window.lucide.createIcons()}function Qt(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=e)}function ht(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function Kt(){window.gFnbPoList&&window.gFnbPoList.length?bt(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function Ut(){let e=(window.gReceiptLines||[]).filter(g=>(g.actual_qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=new Date;n.setHours(0,0,0,0);let a=!1;for(let g of e)if(g.exp_date){let f=new Date(g.exp_date);if(f.setHours(0,0,0,0),f<=n){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let s=document.getElementById("receiptModalSite")?.value||_(),i=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),o=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",l=document.getElementById("receiptModalNotes")?.value||"",d=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",p={site_code:s,receipt_date:r,supplier:o,invoice_no:i,notes:l,created_by:d,lines:e.map(g=>({item_code:g.item_code,qty:g.actual_qty,unit_price:g.unit_price,batch_code:(g.batch_code||"").trim(),exp_date:(g.exp_date||"").trim()||null,note:g.note||""}))},m=document.getElementById("btnSubmitReceipt");m&&(m.disabled=!0,m.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let f=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)})).json();if(!f.success)throw new Error(f.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${f.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${s} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),ht(),await P(s),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(s),O("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(g){console.error("submitCreateReceipt error:",g),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+g.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),m&&(m.disabled=!1,m.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Xt(t){let e=t||_(),n=document.getElementById("fnbReceiptsTableBody"),a=document.getElementById("fnbReceiptsMobileCards");try{let i=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(i.success&&i.data){let r=i.data.receipts||[],o=document.getElementById("fnbReceiptBadgeHistoryCount");o&&(o.textContent=String(r.length)),n&&(r.length?n.innerHTML=r.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${u(l.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${u(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${u(A(l.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${u(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${u(l.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${u(l.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${u(e)}.</td></tr>`),a&&(r.length?a.innerHTML=r.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${u(l.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${u(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${u(A(l.receipt_date))} \u2022 PO: ${u(l.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${u(l.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(s){console.error("loadFnbReceiptsHistory error:",s)}}async function Gt(t){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let a=n.data.lines||[],s=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),r&&(r.textContent=`${a.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let o=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL Nh\u1EADp</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[100px]">M\xE3 L\xF4 SX</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[110px]">H\u1EA1n D\xF9ng (EXP)</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${a.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${u(d.item_name||d.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${u(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${u(d.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${d.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${u(d.exp_date?String(d.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${u(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=o),s&&s.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Yt(t){let e=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||_()||"K001",a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(y=>y.code.toUpperCase()===e.toUpperCase()),s=a?a.ten||a.name:e,i=s.startsWith(e)?s:`${e} - ${s}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=i);let o=document.getElementById("manualReceiptSiteSelect");o&&(o.value=e);let l=document.getElementById("manualReceiptSiteBadge");l&&(l.textContent=e);let d=document.getElementById("manualReceiptDate");d&&(d.value=new Date().toISOString().slice(0,10));let p=document.getElementById("manualReceiptSupplier");p&&!p.value&&(p.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let m=document.getElementById("manualReceiptInvoiceNo");m&&(m.value="");let g=document.getElementById("manualReceiptNotes");g&&(g.value="");let f=document.getElementById("manualItemSearchInput");f&&(f.value="");let h=document.getElementById("manualItemCategorySelect");h&&(h.value=""),window.gManualReceiptLines=[],Q();let c=document.getElementById("modalManualReceipt");c&&c.classList.remove("hidden"),await G(e,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function xt(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function zt(t){let e=document.getElementById("manualReceiptSiteBadge");e&&(e.textContent=t),await G(t,window.gManualShowAllCatalog)}async function Jt(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let e=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await G(e,window.gManualShowAllCatalog)}async function G(t,e){let n=document.getElementById("manualCatalogListContainer");n&&(n.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let a=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${e?"&include_all=1":""}`,i=await(await fetch(a)).json();i.success&&i.data?window.gManualSiteCatalog=i.data.items||[]:window.gManualSiteCatalog=[],j()}catch(a){console.error("loadManualCatalogItems error:",a),n&&(n.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${u(a.message)}</div>`)}}function j(){let t=document.getElementById("manualCatalogListContainer"),e=document.getElementById("manualCatalogCountText"),n=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),a=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),s=window.gManualSiteCatalog||[];if(n&&(s=s.filter(i=>{let r=(i.code||i.sku||"").toLowerCase(),o=(i.name||"").toLowerCase();return r.includes(n)||o.includes(n)})),a&&(s=s.filter(i=>(i.nhom_hang||i.item_group||i.nganh_hang||"").toLowerCase().includes(a))),e&&(e.textContent=String(s.length)),!!t){if(!s.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${n?`v\u1EDBi t\u1EEB kh\xF3a "${u(n)}"`:""}.
      </div>
    `;return}t.innerHTML=s.map(i=>{let r=i.code||i.sku,o=(window.gManualReceiptLines||[]).find(p=>p.item_code===r),l=parseFloat(i.book_qty||0),d=parseFloat(i.unit_price||0);return`
      <div onclick="addManualReceiptItem('${r}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${o?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${u(i.name||r)}">
              ${u(i.name||r)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${u(i.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${u(r)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${l>0?"text-emerald-600":"text-gray-500"} font-mono">${l.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${d>0?Math.round(d).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${o?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${o.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function Zt(t){let e=(window.gManualSiteCatalog||[]).find(a=>(a.code||a.sku)===t);if(!e)return;let n=(window.gManualReceiptLines||[]).find(a=>a.item_code===t);if(n)n.qty=Math.round((n.qty+1)*100)/100;else{let s="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),i=new Date;i.setFullYear(i.getFullYear()+1);let r=i.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:e.code||e.sku,item_name:e.name||e.code,unit:e.unit||"Ph\u1EA7n",unit_price:parseFloat(e.unit_price||0),qty:1,batch_code:s,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}Q(),j()}function Q(){let t=document.getElementById("manualLinesEmptyState"),e=document.getElementById("manualLinesTableWrapper"),n=document.getElementById("manualLinesMobileCards"),a=document.getElementById("btnClearAllManualLines"),s=document.getElementById("manualLinesTableBody"),i=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),o=document.getElementById("manualSummaryTotalQty"),l=document.getElementById("manualSummaryTotalAmount"),d=window.gManualReceiptLines||[];if(i&&(i.textContent=String(d.length)),r&&(r.textContent=d.length+" m\xE3"),!d.length){t&&t.classList.remove("hidden"),e&&(e.classList.add("hidden"),e.classList.remove("lg:block")),n&&(n.classList.add("hidden"),n.classList.remove("block")),a&&(a.classList.add("hidden"),a.classList.remove("flex")),o&&(o.textContent="0"),l&&(l.textContent="0 \u0111");return}t&&t.classList.add("hidden"),e&&(e.classList.remove("hidden"),e.classList.add("lg:block")),n&&(n.classList.remove("hidden"),n.classList.add("block")),a&&(a.classList.remove("hidden"),a.classList.add("flex"));let p=0,m=0;s&&(s.innerHTML=d.map((g,f)=>{let h=(g.qty||0)*(g.unit_price||0);return p+=g.qty||0,m+=h,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${f+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${u(g.item_name)}">
              ${u(g.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${u(g.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${u(g.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${g.qty}" 
                   oninput="onManualLineQtyChange(${f}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${g.unit_price}" 
                   oninput="onManualLinePriceChange(${f}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${f}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${u(g.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${f}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${g.exp_date||""}" 
                   onchange="onManualLineExpChange(${f}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${u(g.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${f}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${f})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=d.map((g,f)=>{let h=(g.qty||0)*(g.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${f+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${u(g.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${u(g.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${f})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${u(g.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${g.qty}" 
                     oninput="onManualLineQtyChange(${f}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${g.unit_price}" 
                     oninput="onManualLinePriceChange(${f}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${h>0?Math.round(h).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${u(g.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${f}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${g.exp_date||""}" 
                   onchange="onManualLineExpChange(${f}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),o&&(o.textContent=p>0?Number.isInteger(p)?String(p):p.toFixed(1):"0"),l&&(l.textContent=m>0?Math.round(m).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function te(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=parseFloat(e);window.gManualReceiptLines[t].qty=isNaN(n)?0:n,nt()}function ee(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=parseFloat(e);window.gManualReceiptLines[t].unit_price=isNaN(n)?0:n,nt()}function nt(){let t=0,e=0;(window.gManualReceiptLines||[]).forEach((s,i)=>{let r=(s.qty||0)*(s.unit_price||0);t+=s.qty||0,e+=r;let o=document.getElementById(`manualLineTotal_${i}`);o&&(o.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let n=document.getElementById("manualSummaryTotalQty"),a=document.getElementById("manualSummaryTotalAmount");n&&(n.textContent=t.toFixed(1)),a&&(a.textContent=Math.round(e).toLocaleString("vi-VN")+" \u0111")}function ne(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=e)}function oe(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=e;let n=document.getElementById(`manualLineExpWarning_${t}`);n&&(n.innerHTML=I(e),window.lucide&&window.lucide.createIcons())}function ae(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=new Date;n.setMonth(n.getMonth()+e);let a=n.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=a;let s=document.getElementById(`manualLineExpInput_${t}`);s&&(s.value=a);let i=document.getElementById(`manualLineExpWarning_${t}`);i&&(i.innerHTML=I(a),window.lucide&&window.lucide.createIcons())}function se(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=e)}function yt(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let e=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),Q(),typeof j=="function"&&j(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(e.item_name||e.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function wt(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let e=document.getElementById("confirmClearManualCountText");e&&(e.textContent=String(t.length));let n=document.getElementById("modalConfirmClearManualLines");n&&(n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function vt(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function re(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],vt(),Q(),j(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function ie(){let e=(window.gManualReceiptLines||[]).filter(h=>(h.qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let n=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!n){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let a=new Date;a.setHours(0,0,0,0);let s=!1;for(let h of e)if(h.exp_date){let c=new Date(h.exp_date);if(c.setHours(0,0,0,0),c<=a){s=!0;break}}if(s&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let i=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),o=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",l=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",d=(document.getElementById("manualReceiptNotes")?.value||"").trim(),p=`[${o}] ${d}`.trim(),m=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",g={site_code:i,receipt_date:r,supplier:n,invoice_no:l,notes:p,created_by:m,lines:e.map(h=>({item_code:h.item_code,qty:h.qty,unit_price:h.unit_price,batch_code:(h.batch_code||"").trim(),exp_date:(h.exp_date||"").trim()||null,storage_loc:h.storage_loc||"K\u1EC7 B\u1EBFp",note:h.note||""}))},f=document.getElementById("btnSubmitManualReceipt");f&&(f.disabled=!0,f.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${c.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),xt(),await P(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),O("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(h){console.error("submitManualReceipt error:",h),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+h.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),f&&(f.disabled=!1,f.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var w=window;w.gFnbReceiptCurrentView=w.gFnbReceiptCurrentView||"po";w.gFnbPoList=w.gFnbPoList||[];w.gReceiptLines=w.gReceiptLines||[];w.gManualReceiptLines=w.gManualReceiptLines||[];w.gManualSiteCatalog=w.gManualSiteCatalog||[];w.gManualShowAllCatalog=w.gManualShowAllCatalog||!1;w.getActiveFnbReceiptSite=_;w.formatReceiptDateYMD=A;w.getReceiptExpWarningHtml=I;w.switchFnbReceiptSubView=O;w.loadFnbReceipts=At;w.onFnbPoSearchInput=Pt;w.loadFnbPoList=P;w.renderFnbPoTable=et;w.openPoReceiptModal=bt;w.renderReceiptLinesTable=ft;w.onReceiptLineQtyChange=Vt;w.onReceiptLineBatchChange=jt;w.onReceiptLineExpChange=qt;w.setReceiptLineQuickExp=Ot;w.onReceiptLineNoteChange=Qt;w.closeCreateReceiptModal=ht;w.openCreateReceiptModal=Kt;w.submitCreateReceipt=Ut;w.loadFnbReceiptsHistory=Xt;w.viewReceiptDetail=Gt;w.openManualReceiptModal=Yt;w.closeManualReceiptModal=xt;w.onManualReceiptSiteChange=zt;w.toggleManualShowAllCatalog=Jt;w.loadManualCatalogItems=G;w.filterManualCatalogList=j;w.addManualReceiptItem=Zt;w.renderManualReceiptLinesTable=Q;w.onManualLineQtyChange=te;w.onManualLinePriceChange=ee;w.updateManualTotals=nt;w.onManualLineBatchChange=ne;w.onManualLineExpChange=oe;w.setManualLineQuickExp=ae;w.onManualLineLocChange=se;w.removeManualReceiptLine=yt;w.removeManualLine=yt;w.confirmClearAllManualReceiptLines=wt;w.clearAllManualReceiptLines=wt;w.closeConfirmClearManualLinesModal=vt;w.executeClearAllManualReceiptLines=re;w.submitManualReceipt=ie;function N(){let t=document.getElementById("globalBranchSelect")?.value,e=localStorage.getItem("orbit_user_site"),n=window,a=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,s=document.getElementById("fnbWasteFilterSite")?.value,i=t||e||a||s||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function kt(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let e=t.value||N(),n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(a=>a.code!=="ALL");if(n&&n.length){let a="";n.forEach(s=>{a+=`<option value="${s.code}" ${s.code.toUpperCase()===e.toUpperCase()?"selected":""}>${s.name}</option>`}),t.innerHTML=a,e&&Array.from(t.options).some(s=>s.value===e)&&(t.value=e)}}function K(t){let e=document.getElementById("subtab-fnb-waste-stock"),n=document.getElementById("subtab-fnb-waste-history"),a=document.getElementById("fnbWasteSubViewStock"),s=document.getElementById("fnbWasteSubViewHistory");t==="history"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),a&&a.classList.add("hidden"),s&&s.classList.remove("hidden")):(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),a&&a.classList.remove("hidden"),s&&s.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function Lt(t){let e=t||N(),n=document.getElementById("fnbWasteTableBody"),a=document.getElementById("fnbWasteMobileCards"),s=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(r.success&&r.data){let o=r.data.wastes||[];s&&(s.textContent=String(o.length)),n&&(o.length?n.innerHTML=o.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(l.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${u(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${u(String(l.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${u(l.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${u(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${u(l.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${u(e)}.</td></tr>`),a&&(o.length?a.innerHTML=o.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(l.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${u(l.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${u(String(l.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${u(l.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${u(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbWasteHistory error:",i)}}async function de(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let n=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let a=n.data.lines||[],s=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),r&&(r.textContent=`${a.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let o=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL H\u1EE7y</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">L\xFD Do Chi Ti\u1EBFt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${a.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${u(d.item_name||d.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${u(d.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${u(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${u(d.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=o),s&&s.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Ct(){let t=document.getElementById("fnbWasteNganhHangFilter"),e=document.getElementById("fnbWasteNhomHangFilter");if(!t||!e)return;let n=new Map;(window.gFnbWasteStockItems||[]).forEach(s=>{let i=(s.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(s.nhom_hang||s.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(i)||n.set(i,new Set),n.get(i).add(r)}),window.gFnbWasteNganhMap=n;let a='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(s=>{a+=`<option value="${u(s)}">${u(s)}</option>`}),t.innerHTML=a,t.value="",ot("")}function ot(t){let e=document.getElementById("fnbWasteNhomHangFilter");if(!e)return;let n=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(s=>n.add(s)):window.gFnbWasteNganhMap.forEach(s=>s.forEach(i=>n.add(i))));let a='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(s=>{a+=`<option value="${u(s)}">${u(s)}</option>`}),e.innerHTML=a,e.value=""}function le(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";ot(t),U()}function ce(){U()}function ue(t){U()}function pe(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function U(){let t=document.getElementById("fnbWasteStockTableBody"),e=document.getElementById("fnbWasteStockMobileCards"),n=document.getElementById("fnbWasteStockEmptyState"),a=document.getElementById("fnbWasteSummary"),s=document.getElementById("fnbWasteBadgeInStockCount"),i=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),o=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),l=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),d=window.gFnbWasteStockItems||[],p=document.getElementById("kpiWasteInStockCount"),m=document.getElementById("kpiWasteInStockVal");p&&(p.textContent=String(d.length));let g=0;if(d.forEach(c=>{g+=Number(c.total_value)||Number(c.book_qty)*Number(c.unit_price)||0}),m){let c=gt(g);m.innerHTML=`${c.val}<span class="kpi-unit">${c.unit}</span>`}s&&(s.textContent=String(d.length));let f=d.filter(c=>{if(o==="EXP"&&(c.days_remaining!==void 0?Number(c.days_remaining):999)>15&&!c.is_expired||i&&(c.nganh_hang||"").trim().toLowerCase()!==i||r&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==r)return!1;if(l){let y=(c.name||"").toLowerCase(),b=(c.code||"").toLowerCase();if(!y.includes(l)&&!b.includes(l))return!1}return!0});if(a&&(a.textContent=`Hi\u1EC3n th\u1ECB ${f.length} / ${d.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),at(),!f.length){t&&(t.innerHTML=""),e&&(e.innerHTML=""),n&&n.classList.remove("hidden");return}n&&n.classList.add("hidden");let h=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=f.map((c,y)=>{let b=Number(c.book_qty)||0,x=Number(c.unit_price)||0,k=Number(c.total_value)||b*x,v=c.wasteQty||0,M=v*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(c.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${u(c.name||c.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${u(c.nganh_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${c.nhom_hang&&c.nhom_hang!==c.nganh_hang?`<span>\u2022</span><span>${u(c.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${u(c.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${b.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(k).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${b}" value="${v>0?v:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${u(c.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${u(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(S=>`<option value="${u(S)}" ${c.wasteReason===S?"selected":""}>${u(S)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${u(c.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${M>0?Math.round(M).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${u(c.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${u(c.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=f.map(c=>{let y=Number(c.book_qty)||0,b=Number(c.unit_price)||0,x=c.wasteQty||0,k=x*b;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${u(c.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${u(c.name||c.code)}</h4>
              <div class="text-xs text-gray-400">${u(c.nganh_hang||c.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${y.toFixed(1)} ${u(c.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(b).toLocaleString("vi-VN")} \u20AB / ${u(c.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${y.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${y}" value="${x>0?x:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${u(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${u(c.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${k>0?Math.round(k).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${u(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(v=>`<option value="${u(v)}" ${c.wasteReason===v?"selected":""}>${u(v)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function ge(t,e){let n=(window.gFnbWasteStockItems||[]).find(l=>l.code===t);if(!n)return;let a=parseFloat(e),s=Number(n.book_qty)||0;isNaN(a)||a<0?n.wasteQty=0:a>s?(n.wasteQty=s,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${s})`)):n.wasteQty=a;let i=n.wasteQty*(Number(n.unit_price)||0),r=document.getElementById(`wasteLineTotal_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let o=document.getElementById(`mobWasteLineTotal_${t}`);o&&(o.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),at()}function me(t,e){let n=(window.gFnbWasteStockItems||[]).find(a=>a.code===t);n&&(n.wasteReason=e)}function be(t,e){let n=(window.gFnbWasteStockItems||[]).find(a=>a.code===t);n&&(n.wasteNote=e)}function at(){let t=window.gFnbWasteStockItems||[],e=0,n=0;t.forEach(o=>{o.wasteQty>0&&(e++,n+=o.wasteQty*(Number(o.unit_price)||0))});let a=document.getElementById("kpiWasteSelectedCount");a&&(a.textContent=String(e));let s=document.getElementById("kpiWasteTotalEstAmount");if(s)if(n>0){let o=gt(n);s.innerHTML=`${o.val}<span class="kpi-unit">${o.unit}</span>`}else s.textContent="0 \u20AB";let i=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");i&&(i.disabled=e===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${e})`)}async function fe(){let e=(window.gFnbWasteStockItems||[]).filter(l=>(l.wasteQty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=N(),a=new Date().toISOString().slice(0,10),s=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",i=0;e.forEach(l=>{i+=l.wasteQty*(Number(l.unit_price)||0)});let r={site_code:n,waste_date:a,reason:e.length===1?e[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:s,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${e.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:s,lines:e.map(l=>({item_code:l.code,qty:l.wasteQty,unit_price:Number(l.unit_price)||0,reason_detail:l.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:l.wasteNote||""}))},o=document.getElementById("btnSubmitDirectWaste");o&&(o.disabled=!0,o.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let d=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!d.success)throw new Error(d.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${d.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${n} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),K("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(l){console.error("submitDirectWaste error:",l),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+l.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),o&&(o.disabled=!1,o.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function he(){let t=document.getElementById("createWasteModal"),e=N(),n=document.getElementById("wasteModalSite"),a=document.getElementById("wasteModalDate");if(a&&!a.value&&(a.value=new Date().toISOString().slice(0,10)),n){let i="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{i+=`<option value="${r.code}" ${r.code===e?"selected":""}>${r.ten||r.name}</option>`}),n.innerHTML=i,n.value=e}await st(e);let s=document.getElementById("wasteLinesContainer");s&&(s.innerHTML=""),rt(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function St(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function xe(){let t=document.getElementById("wasteModalSite")?.value||"K001";await st(t);let e=document.getElementById("wasteLinesContainer");e&&(e.innerHTML=""),rt()}async function st(t){try{let n=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=n.success&&n.data?n.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function rt(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=window.gWasteModalInStockItems||[],n="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),a='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';e.forEach(i=>{a+=`<option value="${u(i.code)}" data-price="${i.unit_price}" data-unit="${u(i.unit||"")}" data-stock="${i.book_qty}">[${u(i.code)}] ${u(i.name)} (T\u1ED3n: ${Number(i.book_qty).toFixed(1)} ${u(i.unit||"")})</option>`});let s=`
    <div id="${n}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${n}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${a}
        </select>
        <button type="button" onclick="document.getElementById('${n}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${n}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">\u0110\u01A1n Gi\xE1</label>
          <div class="waste-modal-price py-1 px-2 text-xs tabular-nums text-gray-600 dark:text-gray-300 font-mono">0 \u20AB</div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Th\xE0nh Ti\u1EC1n</label>
          <div class="waste-modal-amt py-1 px-2 text-xs font-bold tabular-nums text-rose-600 text-right font-mono">0 \u20AB</div>
        </div>
      </div>
    </div>
  `;t.insertAdjacentHTML("beforeend",s),window.lucide&&window.lucide.createIcons()}function ye(t,e){let n=document.getElementById(t);if(!n)return;let a=e.options[e.selectedIndex],s=Number(a?.getAttribute("data-price"))||0,i=Number(a?.getAttribute("data-stock"))||0,r=n.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(s).toLocaleString("vi-VN")+" \u20AB");let o=n.querySelector(".waste-modal-qty");o&&(o.max=String(i),o.placeholder=`T\u1ED1i \u0111a ${i.toFixed(1)}`),Mt(t,o?o.value:"0")}function Mt(t,e){let n=document.getElementById(t);if(!n)return;let a=n.querySelector("select"),s=a?.options[a.selectedIndex],i=Number(s?.getAttribute("data-price"))||0,o=(parseFloat(e)||0)*i,l=n.querySelector(".waste-modal-amt");l&&(l.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),Tt()}function Tt(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=0;t.querySelectorAll(".p-3").forEach(a=>{let s=a.querySelector("select"),i=s?.options[s.selectedIndex],r=Number(i?.getAttribute("data-price"))||0,o=a.querySelector(".waste-modal-qty"),l=parseFloat(o?.value||"0")||0;e+=l*r});let n=document.getElementById("wasteModalTotalAmount");n&&(n.textContent=e>0?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function we(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=[];if(t.querySelectorAll(".p-3").forEach(p=>{let m=p.querySelector("select"),g=m?.value,f=m?.options[m.selectedIndex],h=Number(f?.getAttribute("data-price"))||0,c=p.querySelector(".waste-modal-qty"),y=parseFloat(c?.value||"0")||0;g&&y>0&&e.push({item_code:g,qty:y,unit_price:h,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let n=document.getElementById("wasteModalSite")?.value||N(),a=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",i=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",o=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",l={site_code:n,waste_date:a,reason:s,confirmed_by:i,notes:r,created_by:o,lines:e},d=document.getElementById("btnSubmitWaste");d&&(d.disabled=!0,d.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let m=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(!m.success)throw new Error(m.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${m.data.waste_code}!`),St(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),K("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(p){console.error("submitCreateWaste error:",p),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+p.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),d&&(d.disabled=!1,d.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function Ve(){kt();let t=N(),e=document.getElementById("fnbWasteFilterSite");e&&e.value!==t&&(e.value=t);let n=document.getElementById("fnbWasteSummary");n&&(n.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let s=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();s.success&&s.data?window.gFnbWasteStockItems=(s.data.items||[]).map(i=>({...i,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],Ct(),U(),Lt(t)}catch(a){console.error("loadFnbWaste error:",a),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+a.message)}}var L=window;L.gFnbWasteStockItems=L.gFnbWasteStockItems||[];L.gFnbWasteNganhMap=L.gFnbWasteNganhMap||null;L.gWasteModalInStockItems=L.gWasteModalInStockItems||[];L.getActiveFnbWasteSite=N;L.populateFnbWasteSiteDropdown=kt;L.loadFnbWaste=Ve;L.switchFnbWasteSubView=K;L.populateFnbWasteFilters=Ct;L.populateFnbWasteNhomHangDropdown=ot;L.onFnbWasteNganhHangChange=le;L.onFnbWasteFilterChange=ce;L.onFnbWasteSearch=ue;L.onFnbWasteSiteChange=pe;L.renderFnbWasteStockTable=U;L.onWasteLineQtyChange=ge;L.onWasteLineReasonChange=me;L.onWasteLineNoteChange=be;L.updateWasteKPIs=at;L.submitDirectWaste=fe;L.loadFnbWasteHistory=Lt;L.viewWasteDetail=de;L.openCreateWasteModal=he;L.closeCreateWasteModal=St;L.onWasteModalSiteChange=xe;L.loadWasteModalItems=st;L.addWasteLineRow=rt;L.onWasteModalItemSelect=ye;L.onWasteModalLineQtyInput=Mt;L.recalculateWasteModalTotal=Tt;L.submitCreateWaste=we;function R(){let t=localStorage.getItem("orbit_user_site"),e=document.getElementById("globalBranchSelect")?.value,n=window,a=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,s=document.getElementById("fnbCountSiteSelect")?.value,i=t||e||a||s||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function it(){let t=document.getElementById("fnbCountNganhHangFilter"),e=document.getElementById("fnbCountNhomHangFilter");if(!t||!e)return;let n=new Map;(window.gFnbAllItems||[]).forEach(i=>{let r=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),o=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(r)||n.set(r,new Set),n.get(r).add(o)}),window.gFnbNganhMap=n;let s='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(i=>{s+=`<option value="${u(i)}">${u(i)}</option>`}),t.innerHTML=s,t.value="",dt("")}function dt(t){let e=document.getElementById("fnbCountNhomHangFilter");if(!e)return;let n=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(s=>n.add(s)):window.gFnbNganhMap.forEach(s=>s.forEach(i=>n.add(i))));let a='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(s=>{a+=`<option value="${u(s)}">${u(s)}</option>`}),e.innerHTML=a,e.value=""}function ve(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";dt(t),F()}function ke(){F()}function Le(t){F()}function Ce(){F()}function Se(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let e=document.getElementById("globalBranchSelect");e&&(e.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function Me(t){window.gFnbBlindCount=t,F()}function Te(t,e){let n=(window.gCurrentCountItems||[]).find(a=>a.code===t);n&&(n.userCount=e===""?0:Number(e),F())}function Ee(t,e){let n=(window.gCurrentCountItems||[]).find(a=>a.code===t);n&&(n.userNote=e)}function F(){let t=document.getElementById("fnbCountsTableBody"),e=document.getElementById("fnbCountsMobileCards"),n=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),a=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),s=document.getElementById("fnbCountStatusFilter")?.value||"all",i=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),r=window.gFnbAllItems||[],o=r.filter(c=>{if(n&&(c.nganh_hang||"").trim().toLowerCase()!==n||a&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==a)return!1;if(s!=="all"){let y=Number(c.book_qty)||0,x=(c.userCount!==void 0?Number(c.userCount):c.last_count_qty!==null&&c.last_count_qty!==void 0?Number(c.last_count_qty):y)-y,k=c.userCount!==void 0||c.last_count_qty!==null;if(s==="diff"&&Math.abs(x)<.001||s==="matched"&&Math.abs(x)>=.001||s==="counted"&&!k||s==="uncounted"&&k)return!1}if(i){let y=(c.name||"").toLowerCase(),b=(c.code||"").toLowerCase(),x=(c.nganh_hang||"").toLowerCase(),k=(c.nhom_hang||"").toLowerCase();if(!y.includes(i)&&!b.includes(i)&&!x.includes(i)&&!k.includes(i))return!1}return!0});window.gCurrentCountItems=o;let l=0,d=0,p=0;o.forEach(c=>{let y=Number(c.book_qty)||0,b=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,k=(Number(b)||0)-y,v=k*(Number(c.unit_price)||0);Math.abs(k)<.001?l++:d++,p+=v});let m=document.getElementById("fnbCountMetricTotal");m&&(m.textContent=String(o.length));let g=document.getElementById("fnbCountMetricMatched");g&&(g.textContent=String(l));let f=document.getElementById("fnbCountMetricDiff");f&&(f.textContent=String(d));let h=document.getElementById("fnbCountMetricDiffVal");h&&(h.textContent=(p>0?"+":"")+Math.round(p).toLocaleString("vi-VN")+" \u0111"),t&&(o.length===0?!r||r.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=o.map((c,y)=>{let b=Number(c.book_qty)||0,x=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:b,k=Number(x)||0,v=k-b,M=v*(Number(c.unit_price)||0),S='<span class="text-gray-400 tabular-nums">0</span>';v>0?S=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${v.toFixed(1)}</span>`:v<0&&(S=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${v.toFixed(1)}</span>`);let $='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';M>0?$=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(M).toLocaleString("vi-VN")} \u0111</span>`:M<0&&($=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(M).toLocaleString("vi-VN")} \u0111</span>`);let Z=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${b<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${b.toFixed(1)}</span>`,q=c.nhom_hang||c.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${u(c.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${u(c.code)}</span>
                ${q?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${u(q)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${u(c.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${Z}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${k}" oninput="onCountInputChange('${u(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${S}</td>
            <td class="py-3 px-3 text-right select-all">${$}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${u(c.userNote||"")}" oninput="onCountNoteChange('${u(c.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),e&&(o.length===0?!r||r.length===0?e.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':e.innerHTML=o.map(c=>{let y=Number(c.book_qty)||0,b=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,x=Number(b)||0,k=x-y,v=k*(Number(c.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${u(c.nhom_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${u(c.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${u(c.code)}</span> \u2022 ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111/${u(c.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${y<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":y.toFixed(1)} ${u(c.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${u(c.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${k>0?"text-emerald-600":k<0?"text-rose-600":"text-gray-400"}">
                  ${k>0?"+":""}${k.toFixed(1)} (${(v>0?"+":"")+Math.round(v).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${u(c.userNote||"")}" oninput="onCountNoteChange('${u(c.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Ie(){let t=R(),e=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),n="DAILY",a=window.gCurrentCountItems||[];if(!a||!a.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let s=a.map(r=>{let o=Number(r.book_qty)||0,l=r.userCount!==void 0?Number(r.userCount):r.last_count_qty!==null&&r.last_count_qty!==void 0?Number(r.last_count_qty):o,d=l-o,p=d*(Number(r.unit_price)||0);return{item_code:r.code,item_name:r.name,item_group:r.item_group||r.nhom_hang||"NVL",unit:r.unit,unit_price:Number(r.unit_price)||0,book_qty:o,actual_qty:l,count_qty:l,diff_qty:d,diff_value:p,diff_val:p,note:r.userNote||""}}),i={site_code:t,count_date:e,count_type:n,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:s};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let o=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();if(!o.success)throw new Error(o.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${o.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(r){console.error("saveFnbCountAudit error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Et(t){let e=t||R();try{let a=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(e)}`)).json(),s=document.getElementById("fnbCountsHistoryBody"),i=document.getElementById("fnbCountsHistoryMobileCards");if((s||i)&&a.success){let r=a.data.counts||[];r.length?(s&&(s.innerHTML=r.map(o=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${o.id})">${u(o.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${u(o.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${u(o.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${o.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${o.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${o.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${o.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${o.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${o.diff_value>0||o.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(o.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${u(o.notes||"\u2014")}</td>
            </tr>
          `).join("")),i&&(i.innerHTML=r.map(o=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${o.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${u(o.count_code)}</span>
                <span class="badge ${o.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${o.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${u(o.site_code)}</b></span>
                  <span class="num text-gray-500">${o.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${o.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(o.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${o.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(o.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(o.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(s&&(s.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${u(e)}.</td></tr>`),i&&(i.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${u(e)}.</div>`))}}catch(n){console.error("loadFnbCountsHistory error:",n)}}async function $e(t){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let a=n.data.lines||[],s=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),r&&(r.textContent=`${a.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let o=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-3 text-right">T\u1ED3n S\xE1ch</th>
              <th class="py-2 px-3 text-right">SL \u0110\u1EBFm</th>
              <th class="py-2 px-3 text-right">L\u1EC7ch</th>
              <th class="py-2 px-3 text-right">Ti\u1EC1n L\u1EC7ch</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${a.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${u(d.item_name||d.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${d.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${d.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_qty<0?"text-rose-600":d.diff_qty>0?"text-emerald-600":"text-gray-400"}">${d.diff_qty>0?"+":""}${d.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_val<0?"text-rose-600":d.diff_val>0?"text-emerald-600":"text-gray-400"}">${d.diff_val>0?"+":""}${Math.round(d.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${u(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=o),s&&s.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function _e(){document.getElementById("invDetailModal")?.classList.add("hidden")}function Ne(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let e=R(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),s=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((l,d)=>{let p=Number(l.book_qty)||0,m=l.userCount!==void 0?Number(l.userCount):l.last_count_qty!==null&&l.last_count_qty!==void 0?Number(l.last_count_qty):p,g=m-p;s.push([d+1,l.code,l.name,l.nganh_hang||"",l.nhom_hang||l.item_group||"",l.unit,Number(l.unit_price)||0,p,m,g,l.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let i=XLSX.utils.aoa_to_sheet(s);i["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],i["!autofilter"]={ref:`A1:K${s.length}`},i["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let r=XLSX.utils.decode_range(i["!ref"]||"A1:K1");for(let l=r.s.r;l<=r.e.r;++l)for(let d=r.s.c;d<=r.e.c;++d){let p=XLSX.utils.encode_cell({r:l,c:d});if(i[p])if(l===0)i[p].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:d===0||d===1?"center":d>=6&&d<=9?"right":"left",wrapText:!1}};else{let m=d===0||d>=6&&d<=9,g=d===1||d===5;i[p].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:m?"right":g?"center":"left"}}}}let o=XLSX.utils.book_new();XLSX.utils.book_append_sheet(o,i,"PhieuKiemKe"),XLSX.writeFile(o,`Phieu_Kiem_Ke_${e}_${n}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function je(){let t=R(),e=document.getElementById("fnbCountSiteSelect");e&&e.value!==t&&(e.value=t);let a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(o=>o.code.toUpperCase()===t.toUpperCase()),s=a?a.ten||a.name:t,i=document.getElementById("fnbCountCurrentSiteBadge");i&&(i.textContent=s);let r=document.getElementById("fnbCountDatePicker");r&&!r.value&&(r.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let l=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();l.success&&l.data?(window.gFnbAllItems=l.data.items||[],it(),F()):(window.gFnbAllItems=[],it(),F()),Et(t)}catch(o){console.error("loadFnbCounts error:",o),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var C=window;C.gFnbAllItems=C.gFnbAllItems||[];C.gCurrentCountItems=C.gCurrentCountItems||[];C.gFnbBlindCount=C.gFnbBlindCount||!1;C.gFnbNganhMap=C.gFnbNganhMap||null;C.getActiveFnbCountSite=R;C.loadFnbCounts=je;C.populateFnbCountFilters=it;C.populateFnbCountNhomHangDropdown=dt;C.onFnbCountNganhHangChange=ve;C.onFnbCountFilterChange=ke;C.onFnbCountSearch=Le;C.onFnbCountDateChange=Ce;C.onFnbCountSiteChange=Se;C.toggleBlindCount=Me;C.onCountInputChange=Te;C.onCountNoteChange=Ee;C.renderFnbCountsTable=F;C.saveFnbCountAudit=Ie;C.loadFnbCountsHistory=Et;C.viewCountDetail=$e;C.closeInvDetailModal=_e;C.exportCountSheetExcel=Ne;function lt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let e=t.sites||[],n=t.rows||[],a=t.groups||{},s=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];e.forEach(m=>{s.push(m.ten||m.name||m.code)});let i=[s];n.forEach((m,g)=>{let f=a[m.group]||m.group,h=[g+1,m.code,m.name,f,m.unit,m.price||0];e.forEach(c=>{let y=m.cells?m.cells[c.id]:void 0;h.push(y&&y.book||0)}),i.push(h)});let r=XLSX.utils.aoa_to_sheet(i),o=XLSX.utils.decode_range(r["!ref"]),l=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];e.forEach(()=>l.push({wch:16})),r["!cols"]=l;for(let m=o.s.r;m<=o.e.r;++m)for(let g=o.s.c;g<=o.e.c;++g){let f=XLSX.utils.encode_cell({r:m,c:g});if(!r[f])continue;if(m===0)r[f].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let c="left",y;g===0||g===1||g===4?c="center":(g===5||g>=6)&&(c="right",y="#,##0.00");let b=g>=6&&typeof r[f].v=="number"&&r[f].v<0;r[f].s={font:{name:"Aptos",sz:11,bold:b,color:{rgb:b?"C00000":"000000"}},alignment:{horizontal:c,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},y&&typeof r[f].v=="number"&&(r[f].z=y)}}r["!autofilter"]={ref:r["!ref"]},r["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let d=XLSX.utils.book_new();XLSX.utils.book_append_sheet(d,r,"T\u1ED3n Kho Chu\u1ED7i F&B");let p=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(d,`Ton_Kho_F&B_Chuoi_${p}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(e){console.error("Export Excel error:",e),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(e?.message||e))}}var B=null,E={site:"ALL",group:"ALL",search:"",showValue:!1},ct="";async function It(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);E.site&&E.site!=="ALL"&&E.site!=="all"&&t.searchParams.set("site_code",E.site),E.region&&E.region!=="ALL"&&t.searchParams.set("regionId",E.region),E.group&&E.group!=="ALL"&&t.searchParams.set("group",E.group),t.searchParams.set("refresh","true");let n=await(await fetch(t.toString())).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");B=n.data,window.gFnbStockData=B,Y()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function Y(){if(!B)return;let t=B.sites||[],e=B.rows||[],n=B.groups||{},a=(ct||"").trim().toLowerCase(),s=e.filter(b=>{if(!a)return!0;let x=(b.name||"").toLowerCase().includes(a),k=(b.code||"").toLowerCase().includes(a);return x||k}),i=E.site,r=s;i&&i!=="ALL"&&i!=="all"&&(r=s.filter(b=>{let x=b.cells&&b.cells[i];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let o=0,l=0,d=0;s.forEach(b=>{t.forEach(x=>{let k=b.cells&&b.cells[x.id];if(k){let v=Number(k.value)||0,M=Number(k.book)||0;o+=v,M<0&&l++,k.noOpening&&d++}})});let p=document.getElementById("fnbStockKpiTotalItems"),m=document.getElementById("fnbStockKpiTotalValue"),g=document.getElementById("fnbStockKpiNegative"),f=document.getElementById("fnbStockKpiNoOpening");p&&(p.textContent=r.length.toLocaleString("vi-VN")),m&&(m.textContent=Math.round(o).toLocaleString("vi-VN")+" \u0111"),g&&(g.textContent=l.toLocaleString("vi-VN")),f&&(f.textContent=d.toLocaleString("vi-VN"));let h=document.getElementById("fnbStockTableHead");if(h){let b=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(x=>{let k=x.region==="Mi\u1EC1n Nam";b+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${k?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${k?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),b+="</tr>",h.innerHTML=b}let c=document.getElementById("fnbStockTableBody");c&&(r.length===0?c.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:c.innerHTML=r.map((b,x)=>{let k=n[b.group]||b.group,v=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${k}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${b.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${b.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${b.price?Number(b.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${b.unit}</td>
        `;return t.forEach(M=>{let S=b.cells&&b.cells[M.id]||{book:0,lastCount:null,noOpening:!0,value:0},$=Number(S.book)||0,q=$<0?"text-rose-600 dark:text-rose-400 font-semibold":$>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",X="";if(S.lastCount!==null&&S.lastCount!==void 0&&S.lastCount!==""){let tt=Number(S.lastCount);if(!isNaN(tt)){let Rt=Number.isInteger(tt)?tt.toLocaleString("vi-VN"):tt.toFixed(1);X=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${S.lastDate||"N/A"}): ${Rt}">(${Rt})</span>`}}let V="";S.noOpening&&(V='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let pt="",Ht=Number(S.value)||0;E.showValue&&Ht&&(pt=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(Ht).toLocaleString("vi-VN")} \u0111</div>`);let Pe=Number.isInteger($)?$.toLocaleString("vi-VN"):$.toFixed(1);v+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${V}
                <span class="${q}">${Pe}</span>${X}
              </div>
              ${pt}
            </td>
          `}),v+="</tr>",v}).join(""));let y=document.getElementById("fnbStockMobileCards");y&&(r.length===0?y.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':y.innerHTML=s.map(b=>{let x=n[b.group]||b.group,k=t.map(v=>{let M=b.cells&&b.cells[v.id]||{book:0,lastCount:null,noOpening:!0,value:0},S=Number(M.book)||0,$=S<0,Z=S===0,q=Number.isInteger(S)?S.toLocaleString("vi-VN"):S.toFixed(1),X="";if(M.lastCount!==null&&M.lastCount!==void 0&&M.lastCount!==""){let V=Number(M.lastCount);isNaN(V)||(X=`(${Number.isInteger(V)?V.toLocaleString("vi-VN"):V.toFixed(1)})`)}return{site:v,cell:M,isNeg:$,isZero:Z,bookFormatted:q,countText:X}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${b.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${b.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${b.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${b.price?Number(b.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${k.map(v=>{let M=v.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${v.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":v.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${v.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${M?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${M?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${v.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":v.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${v.bookFormatted} <span class="text-xs text-gray-400 font-normal">${v.countText}</span></span>
                    </div>
                    ${v.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${E.showValue&&v.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(v.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Fe(){let t=document.getElementById("fnbStockFilterRegion"),e=document.getElementById("fnbStockFilterGroup"),n=document.getElementById("fnbStockFilterSite");n&&(E.site=n.value),t&&(E.region=t.value),e&&(E.group=e.value),It()}function Be(t){ct=t,Y()}function He(t){E.showValue=t,Y()}function xo(){lt(B)}var H=window;H.gFnbStockData=B;H.gFnbStockFilter=E;H.gFnbStockSearchTerm=ct;H.loadFnbStock=It;H.renderFnbStock=Y;H.onFnbStockFilterChange=Fe;H.onFnbStockSearch=Be;H.onFnbStockToggleValue=He;H.exportFnbStockExcel=()=>lt(H.gFnbStockData||B);function $t(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function _t(t,e){return typeof window.cellBadge=="function"?window.cellBadge(t,e):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${e}</span>`}function Nt(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let e=document.createElement("div");return e.textContent=t||"",e.innerHTML}function T(t){return typeof window.fmtVND=="function"?window.fmtVND(t):Dt(Number(t)||0)}function Ft(t){return typeof window.fmtNum=="function"?window.fmtNum(t):Wt(Number(t)||0)}function D(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function ut(t){let e=window;e.App||(e.App={}),e.App.items=t}function z(){let t=document.getElementById("dinhMucBody"),e=document.getElementById("orderMobileCards"),n=(document.getElementById("orderSearch")?.value||"").toLowerCase(),a=document.getElementById("fLoai")?.value||"",s=document.getElementById("fChiNhap")?.checked,i=document.getElementById("orderSupplyChannel")?.value||"ALL",o=D().filter(d=>{if(n&&!d.maHang.toLowerCase().includes(n)&&!d.tenSP.toLowerCase().includes(n)||a&&d.tenLoai!==a||s&&(!d.soLuongDat||d.soLuongDat<=0))return!1;if(i==="BTT"){let p=((d.nguonCung||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!p.includes("btt")&&!p.includes("trung t\xE2m")&&!p.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(i==="NCC"){let p=((d.nguonCung||"")+" "+(d.tenLoai||"")).toLowerCase();if(p.includes("btt")||p.includes("trung t\xE2m"))return!1}else if(i==="URGENT"){let p=((d.nganh_hang||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!p.includes("t\u01B0\u01A1i")&&!p.includes("th\u1ECBt")&&!p.includes("rau")&&!p.includes("kh\u1EA9n"))return!1}return!0});if(!o.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),e&&(e.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let l=window.innerWidth>=1024;t&&(l?t.innerHTML=o.map(d=>{let p=d.soLuongDat||"",m=(d.soLuongDat||0)*(d.donGia||0);return`
          <tr>
            <td class="col-code">${$t(d.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${d.tenSP}</span></td>
            <td>${_t("neutral",d.tenLoai||"CCDC")}</td>
            <td>${d.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${T(d.donGia)}</span></td>
            <td class="col-num"><span class="num">${Ft(d.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${p}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${d.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${d.maHang}">${T(m)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),e&&(l?e.innerHTML="":e.innerHTML=o.map(d=>{let p=d.soLuongDat||"",m=(d.soLuongDat||0)*(d.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${$t(d.maHang)}
                  ${_t("neutral",d.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${d.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${d.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${T(d.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${Ft(d.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${p}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${d.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${d.maHang}">${T(m)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Re(){z()}function De(t,e){let a=D().find(s=>s.maHang===t);if(a){a.soLuongDat=Number(e)||0;let s=document.getElementById(`subtotal-${t}`);s&&(s.textContent=T(a.soLuongDat*(a.donGia||0)));let i=document.getElementById(`mob-subtotal-${t}`);i&&(i.textContent=T(a.soLuongDat*(a.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(r=>{r.value!==e&&(r.value=e)})}J()}function J(t,e){let n=document.getElementById("kpiNganSach"),a=document.getElementById("kpiDaDat"),s=t!==void 0?Number(t):Number(n?.dataset?.raw)||Number((n?.textContent||"").replace(/[^\d]/g,""))||0,i=e!==void 0?Number(e):Number(a?.dataset?.raw)||Number((a?.textContent||"").replace(/[^\d]/g,""))||0,o=D().reduce((k,v)=>k+(v.soLuongDat||0)*(v.donGia||0),0),l=i+o,d=s-l,p=s>0?Math.round(l/s*100):0,m=document.getElementById("kpiConLai");m&&(m.dataset.raw=String(d),m.textContent=T(d),m.title=T(d),d<0?(m.classList.remove("text-gray-900","dark:text-white"),m.classList.add("text-rose-600","dark:text-rose-400")):(m.classList.remove("text-rose-600","dark:text-rose-400"),m.classList.add("text-gray-900","dark:text-white")));let g=document.getElementById("kpiDangNhapSub");g&&(g.textContent="\u0110ang nh\u1EADp: "+T(o));let f=document.getElementById("kpiConLaiDelta");f&&(d<0?(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",f.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",f.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let h=document.getElementById("kpiTyLe");h&&(h.textContent=p+"%",p>100?h.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":p>80?h.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":h.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let c=document.getElementById("budUsed");c&&(c.textContent=T(l));let y=document.getElementById("budFill"),b=document.getElementById("budBadge"),x=document.getElementById("budNote");y&&(y.style.width=Math.min(p,100)+"%",p>100?(y.className="h-full rounded-full bg-rose-500 transition-all duration-300",b&&(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",b.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${p-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${p-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):p>80?(y.className="h-full rounded-full bg-amber-500 transition-all duration-300",b&&(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",b.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${p}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(y.className="h-full rounded-full bg-indigo-500 transition-all duration-300",b&&(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${p}%).`)))}async function Bt(){let t=window,e=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",a=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(d=>(d.code||"").toLowerCase()===e.toLowerCase()),s=a?a.ten||a.name:document.getElementById("orderSite")?.value||e,i=document.getElementById("orderSite");if(i&&(i.innerHTML=`<option value="${s}">${s}</option>`,i.value=s),!s)return;let r=document.getElementById("globalMonthPicker")?.value,o=document.getElementById("orderMonth")?.value;if(!o||r&&o!==r){o=r||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let d=document.getElementById("orderMonth");d&&(d.value=o)}let l="";if(o){let d=o.split("-");l=`${d[1]}/${d[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let p=await(await fetch(`/api/quota?site=${encodeURIComponent(s)}&thang=${encodeURIComponent(l)}&refresh=true`)).json();if(p.success){ut(p.data.items||[]);let m=document.getElementById("kpiNganSach");m&&(m.dataset.raw=String(p.data.nganSach),m.textContent=T(p.data.nganSach),m.title=T(p.data.nganSach));let g=document.getElementById("kpiSubSite");g&&(g.textContent=p.data.site||s,g.title=p.data.site||s);let f=document.getElementById("kpiDaDat");f&&(f.dataset.raw=String(p.data.tienDaDat),f.textContent=T(p.data.tienDaDat),f.title=T(p.data.tienDaDat));let h=document.getElementById("budTotal");h&&(h.textContent=T(p.data.nganSach));let c=D(),y=Array.from(new Set(c.map(x=>x.tenLoai).filter(Boolean))),b=document.getElementById("fLoai");b&&(b.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+y.map(x=>`<option value="${x}">${x}</option>`).join("")),z(),J(p.data.nganSach,p.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(p.error||""))}catch(d){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(d?.message||d))}finally{typeof hideLoading=="function"&&hideLoading()}}function We(){let e=D().filter(r=>(r.soLuongDat||0)>0);if(!e.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let n=document.getElementById("orderSite")?.value||"",a=document.getElementById("orderMonth")?.value||"",s=e.reduce((r,o)=>r+(o.soLuongDat||0)*(o.donGia||0),0),i=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${n}</b></div>
        <div>Th\xE1ng: <b>${a}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${T(s)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${e.map(r=>`
              <tr><td class="p-2 tabular-nums">${r.maHang}</td><td class="p-2">${r.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${r.soLuongDat}</td><td class="p-2 text-right tabular-nums">${T((r.soLuongDat||0)*r.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${e.map(r=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${Nt(r.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${Nt(r.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${r.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${T((r.soLuongDat||0)*r.donGia)}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div>
        <label class="font-bold block mb-1">Ghi ch\xFA / Gi\u1EA3i tr\xECnh:</label>
        <textarea id="orderNote" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Ghi ch\xFA \u0111\u01A1n h\xE0ng..."></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeGeneralModal()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold">Xem l\u1EA1i</button>
        <button onclick="submitOrder()" class="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm">G\u1EEDi \u0111\u01A1n \u0111\u1EB7t h\xE0ng</button>
      </div>
    </div>
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",i)}async function Ae(){let t=window,e=D(),n=e.filter(o=>(o.soLuongDat||0)>0),a=document.getElementById("orderSite")?.value||"",s=document.getElementById("orderMonth")?.value||"",i=document.getElementById("orderNote"),r=i?i.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let o={site:a,thang:s,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:r,items:n.map(p=>({maHang:p.maHang,tenSP:p.tenSP,dvt:p.dvt,donGia:p.donGia,soLuong:p.soLuongDat||0,daDat:p.daDat}))},d=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json();d.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${d.data.maDon}`),e.forEach(p=>{p.soLuongDat=0}),Bt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(o){typeof showToast=="function"&&showToast("L\u1ED7i: "+(o?.message||o))}finally{typeof hideLoading=="function"&&hideLoading()}}var W=window;W.loadQuota=Bt;W.renderOrderTable=z;W.filterItems=Re;W.onQtyChange=De;W.calcBudget=J;W.reviewOrder=We;W.submitOrder=Ae;W.getAppOrderItems=D;W.setAppOrderItems=ut;console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{Zt as addManualReceiptItem,rt as addWasteLineRow,Je as api,J as calcBudget,vt as closeConfirmClearManualLinesModal,ht as closeCreateReceiptModal,St as closeCreateWasteModal,_e as closeInvDetailModal,xt as closeManualReceiptModal,wt as confirmClearAllManualReceiptLines,Ye as debounce,u as escapeHtml,re as executeClearAllManualReceiptLines,Ne as exportCountSheetExcel,lt as exportFnbStockExcel,Re as filterItems,j as filterManualCatalogList,Ft as fmtNum,T as fmtVND,gt as formatCompactVND,Ge as formatDateYMD,Wt as formatNumber,A as formatReceiptDateYMD,Dt as formatVND,B as gFnbStockData,E as gFnbStockFilter,ct as gFnbStockSearchTerm,R as getActiveFnbCountSite,_ as getActiveFnbReceiptSite,N as getActiveFnbWasteSite,D as getAppItems,I as getReceiptExpWarningHtml,xo as handleExportFnbStockExcel,je as loadFnbCounts,Et as loadFnbCountsHistory,P as loadFnbPoList,At as loadFnbReceipts,Xt as loadFnbReceiptsHistory,It as loadFnbStock,Ve as loadFnbWaste,Lt as loadFnbWasteHistory,G as loadManualCatalogItems,Bt as loadQuota,st as loadWasteModalItems,Te as onCountInputChange,Ee as onCountNoteChange,Ce as onFnbCountDateChange,ke as onFnbCountFilterChange,ve as onFnbCountNganhHangChange,Le as onFnbCountSearch,Se as onFnbCountSiteChange,Pt as onFnbPoSearchInput,Fe as onFnbStockFilterChange,Be as onFnbStockSearch,He as onFnbStockToggleValue,ce as onFnbWasteFilterChange,le as onFnbWasteNganhHangChange,ue as onFnbWasteSearch,pe as onFnbWasteSiteChange,ne as onManualLineBatchChange,oe as onManualLineExpChange,se as onManualLineLocChange,ee as onManualLinePriceChange,te as onManualLineQtyChange,zt as onManualReceiptSiteChange,De as onQtyChange,jt as onReceiptLineBatchChange,qt as onReceiptLineExpChange,Qt as onReceiptLineNoteChange,Vt as onReceiptLineQtyChange,be as onWasteLineNoteChange,ge as onWasteLineQtyChange,me as onWasteLineReasonChange,ye as onWasteModalItemSelect,Mt as onWasteModalLineQtyInput,xe as onWasteModalSiteChange,Kt as openCreateReceiptModal,he as openCreateWasteModal,Yt as openManualReceiptModal,bt as openPoReceiptModal,it as populateFnbCountFilters,dt as populateFnbCountNhomHangDropdown,Ct as populateFnbWasteFilters,ot as populateFnbWasteNhomHangDropdown,kt as populateFnbWasteSiteDropdown,Tt as recalculateWasteModalTotal,yt as removeManualReceiptLine,F as renderFnbCountsTable,et as renderFnbPoTable,Y as renderFnbStock,U as renderFnbWasteStockTable,Q as renderManualReceiptLinesTable,z as renderOrderTable,ft as renderReceiptLinesTable,We as reviewOrder,_t as safeCellBadge,$t as safeCellCode,Nt as safeEscapeHtml,Ie as saveFnbCountAudit,ut as setAppItems,ae as setManualLineQuickExp,Ot as setReceiptLineQuickExp,Ut as submitCreateReceipt,we as submitCreateWaste,fe as submitDirectWaste,ie as submitManualReceipt,Ae as submitOrder,O as switchFnbReceiptSubView,K as switchFnbWasteSubView,Me as toggleBlindCount,Jt as toggleManualShowAllCatalog,nt as updateManualTotals,at as updateWasteKPIs,$e as viewCountDetail,Gt as viewReceiptDetail,de as viewWasteDetail};
