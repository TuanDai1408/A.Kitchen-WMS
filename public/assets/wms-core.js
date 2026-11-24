function Fe(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function rt(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let e=Number(t),n=Math.abs(e),o=e<0?"-":"",i=e.toLocaleString("vi-VN")+" \u20AB";if(n>=1e9){let r=(n/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:o+r,unit:"t\u1EF7 \u20AB",full:i}}else if(n>=1e6){let r=(n/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:o+r,unit:"tr \u20AB",full:i}}else return{val:o+n.toLocaleString("vi-VN"),unit:"\u20AB",full:i}}function Ne(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let e=new Date(t);if(isNaN(e.getTime()))return String(t);let n=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${n}-${o}-${i}`}catch{return String(t)}}function Be(t,e=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:e})}function d(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Re(t,e=200){let n=null;return function(...o){n&&clearTimeout(n),n=setTimeout(()=>{t.apply(this,o)},e)}}var lt=class{cache=new Map;defaultTtl=3e4;async get(e,n=this.defaultTtl){let o=Date.now(),i=this.cache.get(e);if(i&&o-i.timestamp<n)return o-i.timestamp>1e4&&fetch(e).then(r=>r.json()).then(r=>{r.success&&this.cache.set(e,{timestamp:Date.now(),data:r})}).catch(()=>{}),i.data;try{let s=await(await fetch(e)).json();return s.success&&this.cache.set(e,{timestamp:o,data:s}),s}catch(r){return{success:!1,error:r instanceof Error?r.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(e,n){this.cache.clear();try{return await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}catch(o){return{success:!1,error:o instanceof Error?o.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(e){if(!e){this.cache.clear();return}for(let n of this.cache.keys())n.includes(e)&&this.cache.delete(n)}async getPoList(e,n="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(n)}`)}async getPoDetails(e){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}`)}async getReceiptHistory(e){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(e)}`)}async getInventory(e){return this.get(`/api/wh/inventory?site=${encodeURIComponent(e)}`)}async submitManualReceipt(e){return this.post("/api/fnb/manual-receipt",e)}},We=new lt;function I(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let e=window,n=typeof e.App<"u"&&e.App.currentBranch?e.App.currentBranch.toUpperCase():"K001";return n==="ALL"||!n?"K001":n}function H(t){if(!t||t==="\u2014")return"\u2014";let e=String(t).trim(),n=e.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;try{let o=new Date(e);if(!isNaN(o.getTime())){let i=o.getFullYear(),r=String(o.getMonth()+1).padStart(2,"0"),s=String(o.getDate()).padStart(2,"0");return`${i}-${r}-${s}`}}catch{}return e.slice(0,10)}function E(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let e=new Date;e.setHours(0,0,0,0);let n=new Date(t);n.setHours(0,0,0,0);let o=Math.ceil((n.getTime()-e.getTime())/(1e3*60*60*24));return o<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(o)} ng\xE0y)</span>`:o===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':o<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${o} ng\xE0y)</span>`:o<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${o} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${o} ng\xE0y</span>`}function V(t){window.gFnbReceiptCurrentView=t;let e=document.getElementById("fnbReceiptTabBtnPo"),n=document.getElementById("fnbReceiptTabBtnHistory"),o=document.getElementById("fnbPoListView"),i=document.getElementById("fnbReceiptHistoryView");t==="po"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),o&&o.classList.remove("hidden"),i&&i.classList.add("hidden"),W()):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),e&&(e.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),i&&i.classList.remove("hidden"),o&&o.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function Mt(t){let e=t||I(),n=document.getElementById("fnbReceiptFilterSite");n&&(n.value=e);let i=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(a=>a.code.toUpperCase()===e.toUpperCase()),r=i?i.ten||i.name:e,s=document.getElementById("fnbReceiptCurrentSiteBadge");s&&(s.textContent=r),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(e):await W(e)}function Tt(t){Y(t)}async function W(t){let e=t||I(),n=document.getElementById("fnbPoStatusFilter"),o=n?n.value:"OPEN",i=document.getElementById("fnbPoSummaryText");try{i&&(i.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${e}...`);let s=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(o)}&no-cache=1`)).json();if(s.success&&s.data){window.gFnbPoList=s.data;let a=document.getElementById("fnbPoSearchInput")?.value||"";Y(a);let l=(window.gFnbPoList||[]).filter(h=>h.status==="OPEN").length,u=document.getElementById("fnbReceiptBadgePendingCount");u&&(u.textContent=String(l))}else throw new Error(s.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(r){console.error("loadFnbPoList error:",r),i&&(i.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+r.message)}}function Y(t=""){let e=document.getElementById("fnbPoTableBody"),n=document.getElementById("fnbPoMobileCards"),o=document.getElementById("fnbPoSummaryText"),i=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),r=(t||"").toLowerCase().trim(),s=window.gFnbPoList||[];i&&(s=s.filter(a=>{let l=(a.supplier_name||"").toLowerCase();return i==="siba"?l.includes("siba")||l.includes("b\u1EBFp trung t\xE2m")||l.includes("trung t\xE2m"):i==="baf"?l.includes("baf")||l.includes("th\u1ECBt"):i==="spice"?l.includes("gia v\u1ECB")||l.includes("\u0111\u01B0\u1EDDng")||l.includes("unilever")||l.includes("cholimex")||l.includes("mu\u1ED1i"):i==="veg"?l.includes("rau")||l.includes("\u0111\xE0 l\u1EA1t")||l.includes("c\u1EE7"):!0})),r&&(s=s.filter(a=>{let l=(a.po_number||"").toLowerCase(),u=(a.supplier_name||"").toLowerCase(),h=(a.supplier_code||"").toLowerCase();return l.includes(r)||u.includes(r)||h.includes(r)})),o&&(o.textContent=`Hi\u1EC3n th\u1ECB ${s.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),e&&(s.length===0?e.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':e.innerHTML=s.map(a=>{let l=a.status==="OPEN",u=a.status==="COMPLETED",h=u?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',p=(a.po_number||"").startsWith("50000")||!a.supplier_code||a.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',b=Number(a.total_amount)||0,f=Number(a.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${d(a.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${d(H(a.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${p}
                <span class="font-medium text-gray-900 dark:text-white">${d(a.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${a.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${d(a.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${a.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${f.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${h}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${d(a.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${u?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${u?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${u?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),n&&(s.length===0?n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':n.innerHTML=s.map(a=>{let l=a.status==="COMPLETED",u=(a.po_number||"").startsWith("50000")||!a.supplier_code||a.supplier_name==="B\u1EBFp Trung T\xE2m Siba",h=Number(a.total_amount)||0,m=Number(a.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${u?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${u?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${d(a.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${d(a.po_number)} \u2022 ${d(H(a.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${l?"text-emerald-600":"text-amber-600"} block">${l?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${a.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${m.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${d(a.po_number)}')" class="w-full py-2 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${l?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${l?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function dt(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let n=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let o=n.data;if(!o.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let i=o[0],r=document.getElementById("receiptModalInvoice"),s=document.getElementById("receiptModalInvoiceDisplay"),a=document.getElementById("receiptModalSite"),l=document.getElementById("receiptModalSiteDisplay"),u=document.getElementById("receiptModalSupplier"),h=document.getElementById("receiptModalSupplierDisplay"),m=document.getElementById("receiptModalDate"),p=new Date().toISOString().slice(0,10);r&&(r.value=i.po_number),s&&(s.textContent=i.po_number),a&&(a.value=i.site),l&&(l.textContent=i.site),u&&(u.value=i.supplier_name),h&&(h.textContent=i.supplier_name),m&&(m.value=p);let b="L\xD4-"+p.replace(/-/g,"").slice(2),f=new Date;f.setFullYear(f.getFullYear()+1);let c=f.toISOString().slice(0,10);window.gReceiptLines=o.map(g=>{let w=(g.merch_category||"").toLowerCase(),k=!w.includes("bao b\xEC")&&!w.includes("c\xF4ng c\u1EE5")&&!w.includes("h\xF3a ch\u1EA5t")&&!w.includes("t\u1EA1p ph\u1EA9m");return{po_item:g.po_item,item_code:g.item_code,item_name:g.item_name,merch_category:g.merch_category,unit:g.unit||"KG",unit_price:Number(g.unit_price)||0,order_qty:Number(g.order_qty)||0,actual_qty:Number(g.order_qty)||0,batch_code:b,exp_date:k?c:"",is_food:k,note:""}}),ct();let y=document.getElementById("createReceiptModal");y&&y.classList.remove("hidden")}catch(e){console.error("openPoReceiptModal error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ct(){let t=document.getElementById("receiptLinesTableBody"),e=document.getElementById("receiptLinesMobileCards"),n=document.getElementById("receiptModalLineCount"),o=document.getElementById("receiptModalTotalAmount"),i=window.gReceiptLines||[];n&&(n.textContent=String(i.length));let r=0;t&&(t.innerHTML=i.map((s,a)=>{let l=(s.actual_qty||0)*(s.unit_price||0);return r+=l,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${a+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${d(s.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${d(s.item_code)}</span>
              ${s.merch_category?`<span>\u2022</span><span>${d(s.merch_category)}</span>`:""}
              ${s.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${d(s.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(s.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${a}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${d(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${a}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${a}" value="${s.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${a}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${a}" class="mt-1">
                ${E(s.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${a}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${l>0?Math.round(l).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${d(s.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${a}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=i.map((s,a)=>{let l=(s.actual_qty||0)*(s.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${d(s.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${d(s.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${d(s.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${a+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(s.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${a}" class="num font-bold text-brand-600 dark:text-brand-400">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${s.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${a}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${d(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${a}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${a}" value="${s.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${a}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${a}" class="mt-1">
                ${E(s.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${d(s.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${a}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),o&&(o.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Et(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let n=parseFloat(e);window.gReceiptLines[t].actual_qty=isNaN(n)?0:n;let o=window.gReceiptLines[t],i=(o.actual_qty||0)*(o.unit_price||0),r=document.getElementById(`receiptLineTotal_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let s=document.getElementById(`receiptLineTotalMob_${t}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let a=0;window.gReceiptLines.forEach(u=>{a+=(u.actual_qty||0)*(u.unit_price||0)});let l=document.getElementById("receiptModalTotalAmount");l&&(l.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function _t(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=e)}function It(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=e;let n=document.getElementById(`receiptExpWarning_${t}`);n&&(n.innerHTML=E(e));let o=document.getElementById(`receiptExpWarningMob_${t}`);o&&(o.innerHTML=E(e)),window.lucide&&window.lucide.createIcons()}function $t(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let n=new Date;n.setMonth(n.getMonth()+e);let o=n.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=o;let i=document.getElementById(`receiptLineExpInput_${t}`);i&&(i.value=o);let r=document.getElementById(`receiptLineExpInputMob_${t}`);r&&(r.value=o);let s=document.getElementById(`receiptExpWarning_${t}`);s&&(s.innerHTML=E(o));let a=document.getElementById(`receiptExpWarningMob_${t}`);a&&(a.innerHTML=E(o)),window.lucide&&window.lucide.createIcons()}function Ft(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=e)}function ut(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function Nt(){window.gFnbPoList&&window.gFnbPoList.length?dt(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function Bt(){let e=(window.gReceiptLines||[]).filter(p=>(p.actual_qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=new Date;n.setHours(0,0,0,0);let o=!1;for(let p of e)if(p.exp_date){let b=new Date(p.exp_date);if(b.setHours(0,0,0,0),b<=n){o=!0;break}}if(o&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let i=document.getElementById("receiptModalSite")?.value||I(),r=document.getElementById("receiptModalInvoice")?.value||"",s=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",l=document.getElementById("receiptModalNotes")?.value||"",u=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",h={site_code:i,receipt_date:s,supplier:a,invoice_no:r,notes:l,created_by:u,lines:e.map(p=>({item_code:p.item_code,qty:p.actual_qty,unit_price:p.unit_price,batch_code:(p.batch_code||"").trim(),exp_date:(p.exp_date||"").trim()||null,note:p.note||""}))},m=document.getElementById("btnSubmitReceipt");m&&(m.disabled=!0,m.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let b=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)})).json();if(!b.success)throw new Error(b.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${b.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),ut(),await W(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),V("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(p){console.error("submitCreateReceipt error:",p),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+p.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),m&&(m.disabled=!1,m.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Rt(t){let e=t||I(),n=document.getElementById("fnbReceiptsTableBody"),o=document.getElementById("fnbReceiptsMobileCards");try{let r=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(r.success&&r.data){let s=r.data.receipts||[],a=document.getElementById("fnbReceiptBadgeHistoryCount");a&&(a.textContent=String(s.length)),n&&(s.length?n.innerHTML=s.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${d(l.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${d(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${d(H(l.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${d(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${d(l.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${d(l.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${d(e)}.</td></tr>`),o&&(s.length?o.innerHTML=s.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${d(l.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${d(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${d(H(l.receipt_date))} \u2022 PO: ${d(l.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${d(l.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbReceiptsHistory error:",i)}}async function Ht(t){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let o=n.data.lines||[],i=document.getElementById("invDetailModal"),r=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");r&&(r.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),s&&(s.textContent=`${o.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let a=`
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
            ${o.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${d(u.item_name||u.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${d(u.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(u.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${d(u.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${u.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${d(u.exp_date?String(u.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(u.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(u.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${d(u.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=a),i&&i.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Wt(t){let e=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||I()||"K001",o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(y=>y.code.toUpperCase()===e.toUpperCase()),i=o?o.ten||o.name:e,r=i.startsWith(e)?i:`${e} - ${i}`,s=document.getElementById("manualReceiptSiteNameDisplay");s&&(s.textContent=r);let a=document.getElementById("manualReceiptSiteSelect");a&&(a.value=e);let l=document.getElementById("manualReceiptSiteBadge");l&&(l.textContent=e);let u=document.getElementById("manualReceiptDate");u&&(u.value=new Date().toISOString().slice(0,10));let h=document.getElementById("manualReceiptSupplier");h&&!h.value&&(h.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let m=document.getElementById("manualReceiptInvoiceNo");m&&(m.value="");let p=document.getElementById("manualReceiptNotes");p&&(p.value="");let b=document.getElementById("manualItemSearchInput");b&&(b.value="");let f=document.getElementById("manualItemCategorySelect");f&&(f.value=""),window.gManualReceiptLines=[],q();let c=document.getElementById("modalManualReceipt");c&&c.classList.remove("hidden"),await K(e,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function pt(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function Dt(t){let e=document.getElementById("manualReceiptSiteBadge");e&&(e.textContent=t),await K(t,window.gManualShowAllCatalog)}async function Pt(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let e=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await K(e,window.gManualShowAllCatalog)}async function K(t,e){let n=document.getElementById("manualCatalogListContainer");n&&(n.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let o=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${e?"&include_all=1":""}`,r=await(await fetch(o)).json();r.success&&r.data?window.gManualSiteCatalog=r.data.items||[]:window.gManualSiteCatalog=[],P()}catch(o){console.error("loadManualCatalogItems error:",o),n&&(n.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${d(o.message)}</div>`)}}function P(){let t=document.getElementById("manualCatalogListContainer"),e=document.getElementById("manualCatalogCountText"),n=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),o=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),i=window.gManualSiteCatalog||[];if(n&&(i=i.filter(r=>{let s=(r.code||r.sku||"").toLowerCase(),a=(r.name||"").toLowerCase();return s.includes(n)||a.includes(n)})),o&&(i=i.filter(r=>(r.nhom_hang||r.item_group||r.nganh_hang||"").toLowerCase().includes(o))),e&&(e.textContent=String(i.length)),!!t){if(!i.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${n?`v\u1EDBi t\u1EEB kh\xF3a "${d(n)}"`:""}.
      </div>
    `;return}t.innerHTML=i.map(r=>{let s=r.code||r.sku,a=(window.gManualReceiptLines||[]).find(h=>h.item_code===s),l=parseFloat(r.book_qty||0),u=parseFloat(r.unit_price||0);return`
      <div onclick="addManualReceiptItem('${s}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${a?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${d(r.name||s)}">
              ${d(r.name||s)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${d(r.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${d(s)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${l>0?"text-emerald-600":"text-gray-500"} font-mono">${l.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${u>0?Math.round(u).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${a?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${a.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function At(t){let e=(window.gManualSiteCatalog||[]).find(o=>(o.code||o.sku)===t);if(!e)return;let n=(window.gManualReceiptLines||[]).find(o=>o.item_code===t);if(n)n.qty=Math.round((n.qty+1)*100)/100;else{let i="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),r=new Date;r.setFullYear(r.getFullYear()+1);let s=r.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:e.code||e.sku,item_name:e.name||e.code,unit:e.unit||"Ph\u1EA7n",unit_price:parseFloat(e.unit_price||0),qty:1,batch_code:i,exp_date:s,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}q(),P()}function q(){let t=document.getElementById("manualLinesEmptyState"),e=document.getElementById("manualLinesTableWrapper"),n=document.getElementById("manualLinesMobileCards"),o=document.getElementById("btnClearAllManualLines"),i=document.getElementById("manualLinesTableBody"),r=document.getElementById("manualSelectedCountText"),s=document.getElementById("manualSummaryTotalSkus"),a=document.getElementById("manualSummaryTotalQty"),l=document.getElementById("manualSummaryTotalAmount"),u=window.gManualReceiptLines||[];if(r&&(r.textContent=String(u.length)),s&&(s.textContent=u.length+" m\xE3"),!u.length){t&&t.classList.remove("hidden"),e&&(e.classList.add("hidden"),e.classList.remove("lg:block")),n&&(n.classList.add("hidden"),n.classList.remove("block")),o&&(o.classList.add("hidden"),o.classList.remove("flex")),a&&(a.textContent="0"),l&&(l.textContent="0 \u0111");return}t&&t.classList.add("hidden"),e&&(e.classList.remove("hidden"),e.classList.add("lg:block")),n&&(n.classList.remove("hidden"),n.classList.add("block")),o&&(o.classList.remove("hidden"),o.classList.add("flex"));let h=0,m=0;i&&(i.innerHTML=u.map((p,b)=>{let f=(p.qty||0)*(p.unit_price||0);return h+=p.qty||0,m+=f,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${b+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${d(p.item_name)}">
              ${d(p.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${d(p.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${d(p.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                   oninput="onManualLineQtyChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${p.unit_price}" 
                   oninput="onManualLinePriceChange(${b}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${b}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${f>0?Math.round(f).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${d(p.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${d(p.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=u.map((p,b)=>{let f=(p.qty||0)*(p.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${b+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${d(p.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${d(p.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${d(p.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                     oninput="onManualLineQtyChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${p.unit_price}" 
                     oninput="onManualLinePriceChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${f>0?Math.round(f).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${d(p.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),a&&(a.textContent=h>0?Number.isInteger(h)?String(h):h.toFixed(1):"0"),l&&(l.textContent=m>0?Math.round(m).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Vt(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=parseFloat(e);window.gManualReceiptLines[t].qty=isNaN(n)?0:n,z()}function qt(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=parseFloat(e);window.gManualReceiptLines[t].unit_price=isNaN(n)?0:n,z()}function z(){let t=0,e=0;(window.gManualReceiptLines||[]).forEach((i,r)=>{let s=(i.qty||0)*(i.unit_price||0);t+=i.qty||0,e+=s;let a=document.getElementById(`manualLineTotal_${r}`);a&&(a.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let n=document.getElementById("manualSummaryTotalQty"),o=document.getElementById("manualSummaryTotalAmount");n&&(n.textContent=t.toFixed(1)),o&&(o.textContent=Math.round(e).toLocaleString("vi-VN")+" \u0111")}function jt(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=e)}function Ot(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=e;let n=document.getElementById(`manualLineExpWarning_${t}`);n&&(n.innerHTML=E(e),window.lucide&&window.lucide.createIcons())}function Qt(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=new Date;n.setMonth(n.getMonth()+e);let o=n.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=o;let i=document.getElementById(`manualLineExpInput_${t}`);i&&(i.value=o);let r=document.getElementById(`manualLineExpWarning_${t}`);r&&(r.innerHTML=E(o),window.lucide&&window.lucide.createIcons())}function Kt(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=e)}function gt(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let e=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),q(),typeof P=="function"&&P(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(e.item_name||e.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function mt(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let e=document.getElementById("confirmClearManualCountText");e&&(e.textContent=String(t.length));let n=document.getElementById("modalConfirmClearManualLines");n&&(n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function bt(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function Xt(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],bt(),q(),P(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Ut(){let e=(window.gManualReceiptLines||[]).filter(f=>(f.qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let n=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!n){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let o=new Date;o.setHours(0,0,0,0);let i=!1;for(let f of e)if(f.exp_date){let c=new Date(f.exp_date);if(c.setHours(0,0,0,0),c<=o){i=!0;break}}if(i&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let r=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",s=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",l=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",u=(document.getElementById("manualReceiptNotes")?.value||"").trim(),h=`[${a}] ${u}`.trim(),m=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",p={site_code:r,receipt_date:s,supplier:n,invoice_no:l,notes:h,created_by:m,lines:e.map(f=>({item_code:f.item_code,qty:f.qty,unit_price:f.unit_price,batch_code:(f.batch_code||"").trim(),exp_date:(f.exp_date||"").trim()||null,storage_loc:f.storage_loc||"K\u1EC7 B\u1EBFp",note:f.note||""}))},b=document.getElementById("btnSubmitManualReceipt");b&&(b.disabled=!0,b.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${c.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${r} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),pt(),await W(r),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(r),V("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(f){console.error("submitManualReceipt error:",f),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+f.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),b&&(b.disabled=!1,b.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var x=window;x.gFnbReceiptCurrentView=x.gFnbReceiptCurrentView||"po";x.gFnbPoList=x.gFnbPoList||[];x.gReceiptLines=x.gReceiptLines||[];x.gManualReceiptLines=x.gManualReceiptLines||[];x.gManualSiteCatalog=x.gManualSiteCatalog||[];x.gManualShowAllCatalog=x.gManualShowAllCatalog||!1;x.getActiveFnbReceiptSite=I;x.formatReceiptDateYMD=H;x.getReceiptExpWarningHtml=E;x.switchFnbReceiptSubView=V;x.loadFnbReceipts=Mt;x.onFnbPoSearchInput=Tt;x.loadFnbPoList=W;x.renderFnbPoTable=Y;x.openPoReceiptModal=dt;x.renderReceiptLinesTable=ct;x.onReceiptLineQtyChange=Et;x.onReceiptLineBatchChange=_t;x.onReceiptLineExpChange=It;x.setReceiptLineQuickExp=$t;x.onReceiptLineNoteChange=Ft;x.closeCreateReceiptModal=ut;x.openCreateReceiptModal=Nt;x.submitCreateReceipt=Bt;x.loadFnbReceiptsHistory=Rt;x.viewReceiptDetail=Ht;x.openManualReceiptModal=Wt;x.closeManualReceiptModal=pt;x.onManualReceiptSiteChange=Dt;x.toggleManualShowAllCatalog=Pt;x.loadManualCatalogItems=K;x.filterManualCatalogList=P;x.addManualReceiptItem=At;x.renderManualReceiptLinesTable=q;x.onManualLineQtyChange=Vt;x.onManualLinePriceChange=qt;x.updateManualTotals=z;x.onManualLineBatchChange=jt;x.onManualLineExpChange=Ot;x.setManualLineQuickExp=Qt;x.onManualLineLocChange=Kt;x.removeManualReceiptLine=gt;x.removeManualLine=gt;x.confirmClearAllManualReceiptLines=mt;x.clearAllManualReceiptLines=mt;x.closeConfirmClearManualLinesModal=bt;x.executeClearAllManualReceiptLines=Xt;x.submitManualReceipt=Ut;function $(){let t=document.getElementById("globalBranchSelect")?.value,e=localStorage.getItem("orbit_user_site"),n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,i=document.getElementById("fnbWasteFilterSite")?.value,r=t||e||o||i||"K001";return(r==="ALL"||r==="all")&&(r="K001"),r.toUpperCase()}function ht(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let e=t.value||$(),n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(o=>o.code!=="ALL");if(n&&n.length){let o="";n.forEach(i=>{o+=`<option value="${i.code}" ${i.code.toUpperCase()===e.toUpperCase()?"selected":""}>${i.name}</option>`}),t.innerHTML=o,e&&Array.from(t.options).some(i=>i.value===e)&&(t.value=e)}}function j(t){let e=document.getElementById("subtab-fnb-waste-stock"),n=document.getElementById("subtab-fnb-waste-history"),o=document.getElementById("fnbWasteSubViewStock"),i=document.getElementById("fnbWasteSubViewHistory");t==="history"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&o.classList.add("hidden"),i&&i.classList.remove("hidden")):(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&o.classList.remove("hidden"),i&&i.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function xt(t){let e=t||$(),n=document.getElementById("fnbWasteTableBody"),o=document.getElementById("fnbWasteMobileCards"),i=document.getElementById("fnbWasteBadgeHistoryCount");try{let s=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(s.success&&s.data){let a=s.data.wastes||[];i&&(i.textContent=String(a.length)),n&&(a.length?n.innerHTML=a.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${d(l.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${d(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${d(String(l.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${d(l.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${d(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${d(l.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${d(e)}.</td></tr>`),o&&(a.length?o.innerHTML=a.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${d(l.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${d(l.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${d(String(l.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${d(l.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${d(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(r){console.error("loadFnbWasteHistory error:",r)}}async function Gt(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let n=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let o=n.data.lines||[],i=document.getElementById("invDetailModal"),r=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");r&&(r.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),s&&(s.textContent=`${o.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let a=`
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
            ${o.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${d(u.item_name||u.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${d(u.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${d(u.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(u.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(u.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(u.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${d(u.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=a),i&&i.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ft(){let t=document.getElementById("fnbWasteNganhHangFilter"),e=document.getElementById("fnbWasteNhomHangFilter");if(!t||!e)return;let n=new Map;(window.gFnbWasteStockItems||[]).forEach(i=>{let r=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),s=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(r)||n.set(r,new Set),n.get(r).add(s)}),window.gFnbWasteNganhMap=n;let o='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(i=>{o+=`<option value="${d(i)}">${d(i)}</option>`}),t.innerHTML=o,t.value="",J("")}function J(t){let e=document.getElementById("fnbWasteNhomHangFilter");if(!e)return;let n=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(i=>n.add(i)):window.gFnbWasteNganhMap.forEach(i=>i.forEach(r=>n.add(r))));let o='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(i=>{o+=`<option value="${d(i)}">${d(i)}</option>`}),e.innerHTML=o,e.value=""}function Yt(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";J(t),O()}function zt(){O()}function Jt(t){O()}function Zt(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function O(){let t=document.getElementById("fnbWasteStockTableBody"),e=document.getElementById("fnbWasteStockMobileCards"),n=document.getElementById("fnbWasteStockEmptyState"),o=document.getElementById("fnbWasteSummary"),i=document.getElementById("fnbWasteBadgeInStockCount"),r=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),a=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),l=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),u=window.gFnbWasteStockItems||[],h=document.getElementById("kpiWasteInStockCount"),m=document.getElementById("kpiWasteInStockVal");h&&(h.textContent=String(u.length));let p=0;if(u.forEach(c=>{p+=Number(c.total_value)||Number(c.book_qty)*Number(c.unit_price)||0}),m){let c=rt(p);m.innerHTML=`${c.val}<span class="kpi-unit">${c.unit}</span>`}i&&(i.textContent=String(u.length));let b=u.filter(c=>{if(a==="EXP"&&(c.days_remaining!==void 0?Number(c.days_remaining):999)>15&&!c.is_expired||r&&(c.nganh_hang||"").trim().toLowerCase()!==r||s&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==s)return!1;if(l){let y=(c.name||"").toLowerCase(),g=(c.code||"").toLowerCase();if(!y.includes(l)&&!g.includes(l))return!1}return!0});if(o&&(o.textContent=`Hi\u1EC3n th\u1ECB ${b.length} / ${u.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),Z(),!b.length){t&&(t.innerHTML=""),e&&(e.innerHTML=""),n&&n.classList.remove("hidden");return}n&&n.classList.add("hidden");let f=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=b.map((c,y)=>{let g=Number(c.book_qty)||0,w=Number(c.unit_price)||0,k=Number(c.total_value)||g*w,v=c.wasteQty||0,M=v*w;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${d(c.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${d(c.name||c.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${d(c.nganh_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${c.nhom_hang&&c.nhom_hang!==c.nganh_hang?`<span>\u2022</span><span>${d(c.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${d(c.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(w).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${g.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(k).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${g}" value="${v>0?v:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${d(c.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${d(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${f.map(S=>`<option value="${d(S)}" ${c.wasteReason===S?"selected":""}>${d(S)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${d(c.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${M>0?Math.round(M).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${d(c.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${d(c.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=b.map(c=>{let y=Number(c.book_qty)||0,g=Number(c.unit_price)||0,w=c.wasteQty||0,k=w*g;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${d(c.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${d(c.name||c.code)}</h4>
              <div class="text-xs text-gray-400">${d(c.nganh_hang||c.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${y.toFixed(1)} ${d(c.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(g).toLocaleString("vi-VN")} \u20AB / ${d(c.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${y.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${y}" value="${w>0?w:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${d(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${d(c.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${k>0?Math.round(k).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${d(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${f.map(v=>`<option value="${d(v)}" ${c.wasteReason===v?"selected":""}>${d(v)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function te(t,e){let n=(window.gFnbWasteStockItems||[]).find(l=>l.code===t);if(!n)return;let o=parseFloat(e),i=Number(n.book_qty)||0;isNaN(o)||o<0?n.wasteQty=0:o>i?(n.wasteQty=i,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${i})`)):n.wasteQty=o;let r=n.wasteQty*(Number(n.unit_price)||0),s=document.getElementById(`wasteLineTotal_${t}`);s&&(s.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let a=document.getElementById(`mobWasteLineTotal_${t}`);a&&(a.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),Z()}function ee(t,e){let n=(window.gFnbWasteStockItems||[]).find(o=>o.code===t);n&&(n.wasteReason=e)}function ne(t,e){let n=(window.gFnbWasteStockItems||[]).find(o=>o.code===t);n&&(n.wasteNote=e)}function Z(){let t=window.gFnbWasteStockItems||[],e=0,n=0;t.forEach(a=>{a.wasteQty>0&&(e++,n+=a.wasteQty*(Number(a.unit_price)||0))});let o=document.getElementById("kpiWasteSelectedCount");o&&(o.textContent=String(e));let i=document.getElementById("kpiWasteTotalEstAmount");if(i)if(n>0){let a=rt(n);i.innerHTML=`${a.val}<span class="kpi-unit">${a.unit}</span>`}else i.textContent="0 \u20AB";let r=document.getElementById("btnSubmitDirectWaste"),s=document.getElementById("btnSubmitDirectWasteText");r&&(r.disabled=e===0),s&&(s.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${e})`)}async function oe(){let e=(window.gFnbWasteStockItems||[]).filter(l=>(l.wasteQty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=$(),o=new Date().toISOString().slice(0,10),i=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",r=0;e.forEach(l=>{r+=l.wasteQty*(Number(l.unit_price)||0)});let s={site_code:n,waste_date:o,reason:e.length===1?e[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:i,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${e.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:i,lines:e.map(l=>({item_code:l.code,qty:l.wasteQty,unit_price:Number(l.unit_price)||0,reason_detail:l.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:l.wasteNote||""}))},a=document.getElementById("btnSubmitDirectWaste");a&&(a.disabled=!0,a.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let u=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${u.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${n} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),j("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(l){console.error("submitDirectWaste error:",l),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+l.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),a&&(a.disabled=!1,a.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function ae(){let t=document.getElementById("createWasteModal"),e=$(),n=document.getElementById("wasteModalSite"),o=document.getElementById("wasteModalDate");if(o&&!o.value&&(o.value=new Date().toISOString().slice(0,10)),n){let r="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(s=>{r+=`<option value="${s.code}" ${s.code===e?"selected":""}>${s.ten||s.name}</option>`}),n.innerHTML=r,n.value=e}await tt(e);let i=document.getElementById("wasteLinesContainer");i&&(i.innerHTML=""),et(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function yt(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function ie(){let t=document.getElementById("wasteModalSite")?.value||"K001";await tt(t);let e=document.getElementById("wasteLinesContainer");e&&(e.innerHTML=""),et()}async function tt(t){try{let n=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=n.success&&n.data?n.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function et(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=window.gWasteModalInStockItems||[],n="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),o='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';e.forEach(r=>{o+=`<option value="${d(r.code)}" data-price="${r.unit_price}" data-unit="${d(r.unit||"")}" data-stock="${r.book_qty}">[${d(r.code)}] ${d(r.name)} (T\u1ED3n: ${Number(r.book_qty).toFixed(1)} ${d(r.unit||"")})</option>`});let i=`
    <div id="${n}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${n}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${o}
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
  `;t.insertAdjacentHTML("beforeend",i),window.lucide&&window.lucide.createIcons()}function se(t,e){let n=document.getElementById(t);if(!n)return;let o=e.options[e.selectedIndex],i=Number(o?.getAttribute("data-price"))||0,r=Number(o?.getAttribute("data-stock"))||0,s=n.querySelector(".waste-modal-price");s&&(s.textContent=Math.round(i).toLocaleString("vi-VN")+" \u20AB");let a=n.querySelector(".waste-modal-qty");a&&(a.max=String(r),a.placeholder=`T\u1ED1i \u0111a ${r.toFixed(1)}`),wt(t,a?a.value:"0")}function wt(t,e){let n=document.getElementById(t);if(!n)return;let o=n.querySelector("select"),i=o?.options[o.selectedIndex],r=Number(i?.getAttribute("data-price"))||0,a=(parseFloat(e)||0)*r,l=n.querySelector(".waste-modal-amt");l&&(l.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),vt()}function vt(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=0;t.querySelectorAll(".p-3").forEach(o=>{let i=o.querySelector("select"),r=i?.options[i.selectedIndex],s=Number(r?.getAttribute("data-price"))||0,a=o.querySelector(".waste-modal-qty"),l=parseFloat(a?.value||"0")||0;e+=l*s});let n=document.getElementById("wasteModalTotalAmount");n&&(n.textContent=e>0?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function re(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=[];if(t.querySelectorAll(".p-3").forEach(h=>{let m=h.querySelector("select"),p=m?.value,b=m?.options[m.selectedIndex],f=Number(b?.getAttribute("data-price"))||0,c=h.querySelector(".waste-modal-qty"),y=parseFloat(c?.value||"0")||0;p&&y>0&&e.push({item_code:p,qty:y,unit_price:f,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let n=document.getElementById("wasteModalSite")?.value||$(),o=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",r=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",s=document.getElementById("wasteModalNotes")?.value||"",a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",l={site_code:n,waste_date:o,reason:i,confirmed_by:r,notes:s,created_by:a,lines:e},u=document.getElementById("btnSubmitWaste");u&&(u.disabled=!0,u.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let m=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(!m.success)throw new Error(m.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${m.data.waste_code}!`),yt(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),j("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(h){console.error("submitCreateWaste error:",h),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+h.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),u&&(u.disabled=!1,u.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function Ce(){ht();let t=$(),e=document.getElementById("fnbWasteFilterSite");e&&e.value!==t&&(e.value=t);let n=document.getElementById("fnbWasteSummary");n&&(n.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let i=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();i.success&&i.data?window.gFnbWasteStockItems=(i.data.items||[]).map(r=>({...r,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],ft(),O(),xt(t)}catch(o){console.error("loadFnbWaste error:",o),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+o.message)}}var L=window;L.gFnbWasteStockItems=L.gFnbWasteStockItems||[];L.gFnbWasteNganhMap=L.gFnbWasteNganhMap||null;L.gWasteModalInStockItems=L.gWasteModalInStockItems||[];L.getActiveFnbWasteSite=$;L.populateFnbWasteSiteDropdown=ht;L.loadFnbWaste=Ce;L.switchFnbWasteSubView=j;L.populateFnbWasteFilters=ft;L.populateFnbWasteNhomHangDropdown=J;L.onFnbWasteNganhHangChange=Yt;L.onFnbWasteFilterChange=zt;L.onFnbWasteSearch=Jt;L.onFnbWasteSiteChange=Zt;L.renderFnbWasteStockTable=O;L.onWasteLineQtyChange=te;L.onWasteLineReasonChange=ee;L.onWasteLineNoteChange=ne;L.updateWasteKPIs=Z;L.submitDirectWaste=oe;L.loadFnbWasteHistory=xt;L.viewWasteDetail=Gt;L.openCreateWasteModal=ae;L.closeCreateWasteModal=yt;L.onWasteModalSiteChange=ie;L.loadWasteModalItems=tt;L.addWasteLineRow=et;L.onWasteModalItemSelect=se;L.onWasteModalLineQtyInput=wt;L.recalculateWasteModalTotal=vt;L.submitCreateWaste=re;function R(){let t=localStorage.getItem("orbit_user_site"),e=document.getElementById("globalBranchSelect")?.value,n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,i=document.getElementById("fnbCountSiteSelect")?.value,r=t||e||o||i||"K001";return(r==="ALL"||r==="all")&&(r="K001"),r.toUpperCase()}function nt(){let t=document.getElementById("fnbCountNganhHangFilter"),e=document.getElementById("fnbCountNhomHangFilter");if(!t||!e)return;let n=new Map;(window.gFnbAllItems||[]).forEach(r=>{let s=(r.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),a=(r.nhom_hang||r.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(s)||n.set(s,new Set),n.get(s).add(a)}),window.gFnbNganhMap=n;let i='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(r=>{i+=`<option value="${d(r)}">${d(r)}</option>`}),t.innerHTML=i,t.value="",ot("")}function ot(t){let e=document.getElementById("fnbCountNhomHangFilter");if(!e)return;let n=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(i=>n.add(i)):window.gFnbNganhMap.forEach(i=>i.forEach(r=>n.add(r))));let o='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(i=>{o+=`<option value="${d(i)}">${d(i)}</option>`}),e.innerHTML=o,e.value=""}function le(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";ot(t),F()}function de(){F()}function ce(t){F()}function ue(){F()}function pe(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let e=document.getElementById("globalBranchSelect");e&&(e.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function ge(t){window.gFnbBlindCount=t,F()}function me(t,e){let n=(window.gCurrentCountItems||[]).find(o=>o.code===t);n&&(n.userCount=e===""?0:Number(e),F())}function be(t,e){let n=(window.gCurrentCountItems||[]).find(o=>o.code===t);n&&(n.userNote=e)}function F(){let t=document.getElementById("fnbCountsTableBody"),e=document.getElementById("fnbCountsMobileCards"),n=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),o=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),i=document.getElementById("fnbCountStatusFilter")?.value||"all",r=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),s=window.gFnbAllItems||[],a=s.filter(c=>{if(n&&(c.nganh_hang||"").trim().toLowerCase()!==n||o&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==o)return!1;if(i!=="all"){let y=Number(c.book_qty)||0,w=(c.userCount!==void 0?Number(c.userCount):c.last_count_qty!==null&&c.last_count_qty!==void 0?Number(c.last_count_qty):y)-y,k=c.userCount!==void 0||c.last_count_qty!==null;if(i==="diff"&&Math.abs(w)<.001||i==="matched"&&Math.abs(w)>=.001||i==="counted"&&!k||i==="uncounted"&&k)return!1}if(r){let y=(c.name||"").toLowerCase(),g=(c.code||"").toLowerCase(),w=(c.nganh_hang||"").toLowerCase(),k=(c.nhom_hang||"").toLowerCase();if(!y.includes(r)&&!g.includes(r)&&!w.includes(r)&&!k.includes(r))return!1}return!0});window.gCurrentCountItems=a;let l=0,u=0,h=0;a.forEach(c=>{let y=Number(c.book_qty)||0,g=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,k=(Number(g)||0)-y,v=k*(Number(c.unit_price)||0);Math.abs(k)<.001?l++:u++,h+=v});let m=document.getElementById("fnbCountMetricTotal");m&&(m.textContent=String(a.length));let p=document.getElementById("fnbCountMetricMatched");p&&(p.textContent=String(l));let b=document.getElementById("fnbCountMetricDiff");b&&(b.textContent=String(u));let f=document.getElementById("fnbCountMetricDiffVal");f&&(f.textContent=(h>0?"+":"")+Math.round(h).toLocaleString("vi-VN")+" \u0111"),t&&(a.length===0?!s||s.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=a.map((c,y)=>{let g=Number(c.book_qty)||0,w=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:g,k=Number(w)||0,v=k-g,M=v*(Number(c.unit_price)||0),S='<span class="text-gray-400 tabular-nums">0</span>';v>0?S=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${v.toFixed(1)}</span>`:v<0&&(S=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${v.toFixed(1)}</span>`);let _='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';M>0?_=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(M).toLocaleString("vi-VN")} \u0111</span>`:M<0&&(_=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(M).toLocaleString("vi-VN")} \u0111</span>`);let U=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${g<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${g.toFixed(1)}</span>`,A=c.nhom_hang||c.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${d(c.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${d(c.code)}</span>
                ${A?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${d(A)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${d(c.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${U}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${k}" oninput="onCountInputChange('${d(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${S}</td>
            <td class="py-3 px-3 text-right select-all">${_}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${d(c.userNote||"")}" oninput="onCountNoteChange('${d(c.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),e&&(a.length===0?!s||s.length===0?e.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':e.innerHTML=a.map(c=>{let y=Number(c.book_qty)||0,g=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,w=Number(g)||0,k=w-y,v=k*(Number(c.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${d(c.nhom_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${d(c.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${d(c.code)}</span> \u2022 ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111/${d(c.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${y<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":y.toFixed(1)} ${d(c.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${w}" oninput="onCountInputChange('${d(c.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${k>0?"text-emerald-600":k<0?"text-rose-600":"text-gray-400"}">
                  ${k>0?"+":""}${k.toFixed(1)} (${(v>0?"+":"")+Math.round(v).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${d(c.userNote||"")}" oninput="onCountNoteChange('${d(c.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function he(){let t=R(),e=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),n="DAILY",o=window.gCurrentCountItems||[];if(!o||!o.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let i=o.map(s=>{let a=Number(s.book_qty)||0,l=s.userCount!==void 0?Number(s.userCount):s.last_count_qty!==null&&s.last_count_qty!==void 0?Number(s.last_count_qty):a,u=l-a,h=u*(Number(s.unit_price)||0);return{item_code:s.code,item_name:s.name,item_group:s.item_group||s.nhom_hang||"NVL",unit:s.unit,unit_price:Number(s.unit_price)||0,book_qty:a,actual_qty:l,count_qty:l,diff_qty:u,diff_value:h,diff_val:h,note:s.userNote||""}}),r={site_code:t,count_date:e,count_type:n,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:i};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let a=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!a.success)throw new Error(a.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${a.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(s){console.error("saveFnbCountAudit error:",s),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+s.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function kt(t){let e=t||R();try{let o=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(e)}`)).json(),i=document.getElementById("fnbCountsHistoryBody"),r=document.getElementById("fnbCountsHistoryMobileCards");if((i||r)&&o.success){let s=o.data.counts||[];s.length?(i&&(i.innerHTML=s.map(a=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${a.id})">${d(a.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${d(a.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${d(a.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${a.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${a.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${a.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${a.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${a.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${a.diff_value>0||a.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(a.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${d(a.notes||"\u2014")}</td>
            </tr>
          `).join("")),r&&(r.innerHTML=s.map(a=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${a.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${d(a.count_code)}</span>
                <span class="badge ${a.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${a.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${d(a.site_code)}</b></span>
                  <span class="num text-gray-500">${a.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${a.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(a.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${a.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(a.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(a.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(i&&(i.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${d(e)}.</td></tr>`),r&&(r.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${d(e)}.</div>`))}}catch(n){console.error("loadFnbCountsHistory error:",n)}}async function xe(t){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let o=n.data.lines||[],i=document.getElementById("invDetailModal"),r=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");r&&(r.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),s&&(s.textContent=`${o.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let a=`
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
            ${o.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${d(u.item_name||u.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${u.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${u.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${u.diff_qty<0?"text-rose-600":u.diff_qty>0?"text-emerald-600":"text-gray-400"}">${u.diff_qty>0?"+":""}${u.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${u.diff_val<0?"text-rose-600":u.diff_val>0?"text-emerald-600":"text-gray-400"}">${u.diff_val>0?"+":""}${Math.round(u.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${d(u.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=a),i&&i.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function fe(){document.getElementById("invDetailModal")?.classList.add("hidden")}function ye(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let e=R(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),i=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((l,u)=>{let h=Number(l.book_qty)||0,m=l.userCount!==void 0?Number(l.userCount):l.last_count_qty!==null&&l.last_count_qty!==void 0?Number(l.last_count_qty):h,p=m-h;i.push([u+1,l.code,l.name,l.nganh_hang||"",l.nhom_hang||l.item_group||"",l.unit,Number(l.unit_price)||0,h,m,p,l.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let r=XLSX.utils.aoa_to_sheet(i);r["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],r["!autofilter"]={ref:`A1:K${i.length}`},r["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let s=XLSX.utils.decode_range(r["!ref"]||"A1:K1");for(let l=s.s.r;l<=s.e.r;++l)for(let u=s.s.c;u<=s.e.c;++u){let h=XLSX.utils.encode_cell({r:l,c:u});if(r[h])if(l===0)r[h].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:u===0||u===1?"center":u>=6&&u<=9?"right":"left",wrapText:!1}};else{let m=u===0||u>=6&&u<=9,p=u===1||u===5;r[h].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:m?"right":p?"center":"left"}}}}let a=XLSX.utils.book_new();XLSX.utils.book_append_sheet(a,r,"PhieuKiemKe"),XLSX.writeFile(a,`Phieu_Kiem_Ke_${e}_${n}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function Se(){let t=R(),e=document.getElementById("fnbCountSiteSelect");e&&e.value!==t&&(e.value=t);let o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(a=>a.code.toUpperCase()===t.toUpperCase()),i=o?o.ten||o.name:t,r=document.getElementById("fnbCountCurrentSiteBadge");r&&(r.textContent=i);let s=document.getElementById("fnbCountDatePicker");s&&!s.value&&(s.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let l=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();l.success&&l.data?(window.gFnbAllItems=l.data.items||[],nt(),F()):(window.gFnbAllItems=[],nt(),F()),kt(t)}catch(a){console.error("loadFnbCounts error:",a),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+a.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var C=window;C.gFnbAllItems=C.gFnbAllItems||[];C.gCurrentCountItems=C.gCurrentCountItems||[];C.gFnbBlindCount=C.gFnbBlindCount||!1;C.gFnbNganhMap=C.gFnbNganhMap||null;C.getActiveFnbCountSite=R;C.loadFnbCounts=Se;C.populateFnbCountFilters=nt;C.populateFnbCountNhomHangDropdown=ot;C.onFnbCountNganhHangChange=le;C.onFnbCountFilterChange=de;C.onFnbCountSearch=ce;C.onFnbCountDateChange=ue;C.onFnbCountSiteChange=pe;C.toggleBlindCount=ge;C.onCountInputChange=me;C.onCountNoteChange=be;C.renderFnbCountsTable=F;C.saveFnbCountAudit=he;C.loadFnbCountsHistory=kt;C.viewCountDetail=xe;C.closeInvDetailModal=fe;C.exportCountSheetExcel=ye;function at(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let e=t.sites||[],n=t.rows||[],o=t.groups||{},i=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];e.forEach(m=>{i.push(m.ten||m.name||m.code)});let r=[i];n.forEach((m,p)=>{let b=o[m.group]||m.group,f=[p+1,m.code,m.name,b,m.unit,m.price||0];e.forEach(c=>{let y=m.cells?m.cells[c.id]:void 0;f.push(y&&y.book||0)}),r.push(f)});let s=XLSX.utils.aoa_to_sheet(r),a=XLSX.utils.decode_range(s["!ref"]),l=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];e.forEach(()=>l.push({wch:16})),s["!cols"]=l;for(let m=a.s.r;m<=a.e.r;++m)for(let p=a.s.c;p<=a.e.c;++p){let b=XLSX.utils.encode_cell({r:m,c:p});if(!s[b])continue;if(m===0)s[b].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let c="left",y;p===0||p===1||p===4?c="center":(p===5||p>=6)&&(c="right",y="#,##0.00");let g=p>=6&&typeof s[b].v=="number"&&s[b].v<0;s[b].s={font:{name:"Aptos",sz:11,bold:g,color:{rgb:g?"C00000":"000000"}},alignment:{horizontal:c,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},y&&typeof s[b].v=="number"&&(s[b].z=y)}}s["!autofilter"]={ref:s["!ref"]},s["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let u=XLSX.utils.book_new();XLSX.utils.book_append_sheet(u,s,"T\u1ED3n Kho Chu\u1ED7i F&B");let h=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(u,`Ton_Kho_F&B_Chuoi_${h}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(e){console.error("Export Excel error:",e),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(e?.message||e))}}var N=null,T={site:"ALL",group:"ALL",search:"",showValue:!1},it="";async function Lt(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);T.site&&T.site!=="ALL"&&T.site!=="all"&&t.searchParams.set("site_code",T.site),T.region&&T.region!=="ALL"&&t.searchParams.set("regionId",T.region),T.group&&T.group!=="ALL"&&t.searchParams.set("group",T.group),t.searchParams.set("refresh","true");let n=await(await fetch(t.toString())).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");N=n.data,window.gFnbStockData=N,X()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function X(){if(!N)return;let t=N.sites||[],e=N.rows||[],n=N.groups||{},o=(it||"").trim().toLowerCase(),i=e.filter(g=>{if(!o)return!0;let w=(g.name||"").toLowerCase().includes(o),k=(g.code||"").toLowerCase().includes(o);return w||k}),r=T.site,s=i;r&&r!=="ALL"&&r!=="all"&&(s=i.filter(g=>{let w=g.cells&&g.cells[r];return w&&(w.hasSiteRecord||w.book!==void 0&&Number(w.book)!==0||w.lastCount!==null&&w.lastCount!==void 0)}));let a=0,l=0,u=0;i.forEach(g=>{t.forEach(w=>{let k=g.cells&&g.cells[w.id];if(k){let v=Number(k.value)||0,M=Number(k.book)||0;a+=v,M<0&&l++,k.noOpening&&u++}})});let h=document.getElementById("fnbStockKpiTotalItems"),m=document.getElementById("fnbStockKpiTotalValue"),p=document.getElementById("fnbStockKpiNegative"),b=document.getElementById("fnbStockKpiNoOpening");h&&(h.textContent=s.length.toLocaleString("vi-VN")),m&&(m.textContent=Math.round(a).toLocaleString("vi-VN")+" \u0111"),p&&(p.textContent=l.toLocaleString("vi-VN")),b&&(b.textContent=u.toLocaleString("vi-VN"));let f=document.getElementById("fnbStockTableHead");if(f){let g=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(w=>{let k=w.region==="Mi\u1EC1n Nam";g+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${k?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${k?"MN":"MB"}</span>
            <span title="${w.name}" class="text-gray-800 dark:text-gray-200">${w.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${w.name}">${w.name}</div>
        </th>
      `}),g+="</tr>",f.innerHTML=g}let c=document.getElementById("fnbStockTableBody");c&&(s.length===0?c.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:c.innerHTML=s.map((g,w)=>{let k=n[g.group]||g.group,v=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${w+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${k}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${g.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${g.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${g.price?Number(g.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${g.unit}</td>
        `;return t.forEach(M=>{let S=g.cells&&g.cells[M.id]||{book:0,lastCount:null,noOpening:!0,value:0},_=Number(S.book)||0,A=_<0?"text-rose-600 dark:text-rose-400 font-semibold":_>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",Q="";if(S.lastCount!==null&&S.lastCount!==void 0&&S.lastCount!==""){let G=Number(S.lastCount);if(!isNaN(G)){let St=Number.isInteger(G)?G.toLocaleString("vi-VN"):G.toFixed(1);Q=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${S.lastDate||"N/A"}): ${St}">(${St})</span>`}}let D="";S.noOpening&&(D='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let st="",Ct=Number(S.value)||0;T.showValue&&Ct&&(st=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(Ct).toLocaleString("vi-VN")} \u0111</div>`);let Le=Number.isInteger(_)?_.toLocaleString("vi-VN"):_.toFixed(1);v+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${D}
                <span class="${A}">${Le}</span>${Q}
              </div>
              ${st}
            </td>
          `}),v+="</tr>",v}).join(""));let y=document.getElementById("fnbStockMobileCards");y&&(s.length===0?y.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':y.innerHTML=i.map(g=>{let w=n[g.group]||g.group,k=t.map(v=>{let M=g.cells&&g.cells[v.id]||{book:0,lastCount:null,noOpening:!0,value:0},S=Number(M.book)||0,_=S<0,U=S===0,A=Number.isInteger(S)?S.toLocaleString("vi-VN"):S.toFixed(1),Q="";if(M.lastCount!==null&&M.lastCount!==void 0&&M.lastCount!==""){let D=Number(M.lastCount);isNaN(D)||(Q=`(${Number.isInteger(D)?D.toLocaleString("vi-VN"):D.toFixed(1)})`)}return{site:v,cell:M,isNeg:_,isZero:U,bookFormatted:A,countText:Q}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${w}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${g.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${g.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${g.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${g.price?Number(g.price).toLocaleString("vi-VN")+" \u0111":""}</div>
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
                    ${T.showValue&&v.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(v.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function we(){let t=document.getElementById("fnbStockFilterRegion"),e=document.getElementById("fnbStockFilterGroup"),n=document.getElementById("fnbStockFilterSite");n&&(T.site=n.value),t&&(T.region=t.value),e&&(T.group=e.value),Lt()}function ve(t){it=t,X()}function ke(t){T.showValue=t,X()}function no(){at(N)}var B=window;B.gFnbStockData=N;B.gFnbStockFilter=T;B.gFnbStockSearchTerm=it;B.loadFnbStock=Lt;B.renderFnbStock=X;B.onFnbStockFilterChange=we;B.onFnbStockSearch=ve;B.onFnbStockToggleValue=ke;B.exportFnbStockExcel=()=>at(B.gFnbStockData||N);console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{At as addManualReceiptItem,et as addWasteLineRow,We as api,bt as closeConfirmClearManualLinesModal,ut as closeCreateReceiptModal,yt as closeCreateWasteModal,fe as closeInvDetailModal,pt as closeManualReceiptModal,mt as confirmClearAllManualReceiptLines,Re as debounce,d as escapeHtml,Xt as executeClearAllManualReceiptLines,ye as exportCountSheetExcel,at as exportFnbStockExcel,P as filterManualCatalogList,rt as formatCompactVND,Ne as formatDateYMD,Be as formatNumber,H as formatReceiptDateYMD,Fe as formatVND,N as gFnbStockData,T as gFnbStockFilter,it as gFnbStockSearchTerm,R as getActiveFnbCountSite,I as getActiveFnbReceiptSite,$ as getActiveFnbWasteSite,E as getReceiptExpWarningHtml,no as handleExportFnbStockExcel,Se as loadFnbCounts,kt as loadFnbCountsHistory,W as loadFnbPoList,Mt as loadFnbReceipts,Rt as loadFnbReceiptsHistory,Lt as loadFnbStock,Ce as loadFnbWaste,xt as loadFnbWasteHistory,K as loadManualCatalogItems,tt as loadWasteModalItems,me as onCountInputChange,be as onCountNoteChange,ue as onFnbCountDateChange,de as onFnbCountFilterChange,le as onFnbCountNganhHangChange,ce as onFnbCountSearch,pe as onFnbCountSiteChange,Tt as onFnbPoSearchInput,we as onFnbStockFilterChange,ve as onFnbStockSearch,ke as onFnbStockToggleValue,zt as onFnbWasteFilterChange,Yt as onFnbWasteNganhHangChange,Jt as onFnbWasteSearch,Zt as onFnbWasteSiteChange,jt as onManualLineBatchChange,Ot as onManualLineExpChange,Kt as onManualLineLocChange,qt as onManualLinePriceChange,Vt as onManualLineQtyChange,Dt as onManualReceiptSiteChange,_t as onReceiptLineBatchChange,It as onReceiptLineExpChange,Ft as onReceiptLineNoteChange,Et as onReceiptLineQtyChange,ne as onWasteLineNoteChange,te as onWasteLineQtyChange,ee as onWasteLineReasonChange,se as onWasteModalItemSelect,wt as onWasteModalLineQtyInput,ie as onWasteModalSiteChange,Nt as openCreateReceiptModal,ae as openCreateWasteModal,Wt as openManualReceiptModal,dt as openPoReceiptModal,nt as populateFnbCountFilters,ot as populateFnbCountNhomHangDropdown,ft as populateFnbWasteFilters,J as populateFnbWasteNhomHangDropdown,ht as populateFnbWasteSiteDropdown,vt as recalculateWasteModalTotal,gt as removeManualReceiptLine,F as renderFnbCountsTable,Y as renderFnbPoTable,X as renderFnbStock,O as renderFnbWasteStockTable,q as renderManualReceiptLinesTable,ct as renderReceiptLinesTable,he as saveFnbCountAudit,Qt as setManualLineQuickExp,$t as setReceiptLineQuickExp,Bt as submitCreateReceipt,re as submitCreateWaste,oe as submitDirectWaste,Ut as submitManualReceipt,V as switchFnbReceiptSubView,j as switchFnbWasteSubView,ge as toggleBlindCount,Pt as toggleManualShowAllCatalog,z as updateManualTotals,Z as updateWasteKPIs,xe as viewCountDetail,Ht as viewReceiptDetail,Gt as viewWasteDetail};
