/**
 * Description
 * @param {trackObject,featureObject,divObject}
 * @returns {container}
 */
function SequenceViewer( track,feature,div){

    var thisB = this;
    var subfeatures = feature.get('subfeatures');
    var geneid = feature.get('id');
    var uniqueid = feature._uniqueID;
    var type = feature.get('type');
    var description = feature.get('Note');
    var strand = feature.get('strand');
    var chr = feature.get('seq_id');
    var fstart = feature.get('start');
    var fend = feature.get('end');
    var arrayLength = subfeatures.length;
    var dir;

    var subFeatureObject = new Object();
    var intronArray = [];
    var exonArray = [];
    var utrArray = [];
    var cdsArray = [];

    //Assign strand
    if(strand == 1){
	dir = "forward";
    }else{
	dir = "reverse";
    }

    var container = container || dojo.create('div', { className: 'sequenceViewerContainer', innerHTML: '' } );
    var title_container = dojo.create('div', { className: 'sequenceViewer_header', innerHTML: '<img src="plugins/SeqLighter/img/seqlighter_logo.png" height="35px">'}, container );
    var user_guide = dojo.create('div', { className: 'sequenceViewer_helpguide', innerHTML: '<a href="plugins/SeqLighter/docs/SeqLighter_v1.0_UserGuide.pdf"><img src="plugins/SeqLighter/img/qmark.jpg">&nbsp;User Guideline</a>'}, title_container );
    var field_container = dojo.create('div', { className: 'sequenceViewer_topFields' }, container );
    var table_container = dojo.create('div', { className: 'sequenceViewer_tableContainer'}, field_container );
    var metaTable = dojo.create('table', { className: 'field_metadata_table'}, table_container );
    var r1 = dojo.create('tr', { className:'oddRow',innerHTML: '<td><b>Name</b></td><td>'+geneid+'</td>' }, metaTable );
    var r2 = dojo.create('tr', { className:'evenRow',innerHTML: '<td><b>Type</b></td><td>'+type+'</td>' }, metaTable );
    var r3 = dojo.create('tr', { className:'oddRow',innerHTML: '<td><b>Description</b></td><td>'+description+'</td>' }, metaTable );
    var r4 = dojo.create('tr', { className:'evenRow',innerHTML: '<td><b>Location</b></td><td>'+chr+':'+fstart+'-'+fend+'</td>' }, metaTable );
    var r5 = dojo.create('tr', { className:'oddRow',innerHTML: '<td><b>Strand</b></td><td>'+dir+'</td>' }, metaTable );
    var legend_container = dojo.create('div',{className:'sequenceViewer_legendContainer'}, field_container );
    var seq_container = dojo.create('div',{className: 'sequenceViewer_sequenceContainer'}, container );

    var exon_i = 0;
    var intron_i = 0;
    var utr_i = 0;
    var cds_i = 0;

    for (var i = 0; i < arrayLength; i++) {

	if(subfeatures[i].get('type') == 'exon'){

	    var id = subfeatures[i].get('id');
	    var coord = subfeatures[i].get('start')+'-'+subfeatures[i].get('end');
	    var start_coord = subfeatures[i].get('start');
	    var end_coord = subfeatures[i].get('end');

	    exonArray[exon_i] = {'start': start_coord, 'end': end_coord, 'strand':strand};
	    exon_i++;
	}

	if(subfeatures[i].get('type') == 'CDS'){

	    var start_coord = subfeatures[i].get('start');
	    var end_coord = subfeatures[i].get('end');

	    cdsArray[cds_i] = {'start':start_coord,'end':end_coord};
	    cds_i++;
	}

	if(subfeatures[i].get('type') == 'five_prime_UTR'){

	    var start_coord = subfeatures[i].get('start');
	    var end_coord = subfeatures[i].get('end');

	    utrArray[utr_i] = {'start': start_coord, 'end': end_coord, 'strand': strand};
	    utr_i++;
	}

	if(subfeatures[i].get('type') == 'three_prime_UTR'){

	    var start_coord = subfeatures[i].get('start');
	    var end_coord = subfeatures[i].get('end');

	    utrArray[utr_i] = {'start': start_coord, 'end': end_coord, 'strand':strand};
	    utr_i++;
	}
    }

    //sort exon array
    exonArray = sortArray(exonArray);

    for (var i = 0; i < exonArray.length; i++) {

	var start_coord = exonArray[i].start;
	var end_coord = exonArray[i].end;

	if( (i+1) < exonArray.length){

	    var nextstart_coord = exonArray[i+1].start;
	    var nextend_coord = exonArray[i+1].end;

	    if(strand == 1){
		intronArray[intron_i] = {'start':end_coord,'end':nextstart_coord, 'strand':strand};
	    }else{
		intronArray[intron_i] = {'start':end_coord,'end':nextstart_coord, 'strand':strand};
	    }
	    intron_i++;
	}
    }

    //sort CDS array
    cdsArray = sortArray(cdsArray);

    dojo.create(
	'div', {
	    className: 'test_mk1',
	    id: "test_mk1",
	    innerHTML: ''
	},container);

    testDisplay(track,feature,exonArray,intronArray,cdsArray,utrArray,legend_container,container);

    return container;
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function sortArray(unsortedArray) {

    var sortedArray = [];
    var keyArray = [];
    var tmpArray = [];
    var strand = 1;

    for (var i = 0; i < unsortedArray.length; i++) {
	var start_coord = unsortedArray[i].start;
	var end_coord = unsortedArray[i].end;
	strand = unsortedArray[i].strand;

	tmpArray.push(start_coord);
	keyArray[start_coord]=end_coord;
    }
    tmpArray.sort(function(a, b){return a-b});

    for (var i = 0; i < tmpArray.length; i++) {

	var start_coord = tmpArray[i];
	var end_coord = keyArray[start_coord];
	sortedArray[i] = {'start':start_coord,'end':end_coord, 'strand':strand};
    }

    return sortedArray;
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function testDisplay(track,feature,exonArray,intronArray,cdsArray,utrArray,legend_container,container){

    var thisB = this;
    var start_coord = feature.get('start');
    var end_coord = feature.get('end');
    var strand = feature.get('strand');
    var feat_id = feature.get('id');
    var targetSeqLen= end_coord - start_coord;

    track.store.args.browser.getStore('refseqs', dojo.hitch(this,function( refSeqStore ) {

	if( refSeqStore ) {

	    refSeqStore.getReferenceSequence(
		{ ref: track.store.args.browser.refSeq.name, start: start_coord-4000, end: end_coord+4000},

		dojo.hitch( this, function ( seq ){

		    if(strand == '-1'){
			seq = revcom(seq);
		    }

		    var targetSeq = seq.substr(4000,targetSeqLen);
		    var BioJsObject = showThis(targetSeq,feat_id);
		    window.featid = feat_id;
		    var revseq = revcom(targetSeq);
		    var start_seq = '';
		    var end_seq = '';

		    //5' UTR coordinates
		    //forward strand
		    var adjusted_start_5prime = 0;
		    var adjusted_end_5prime = 0;

		    var cds1_start;
		    var cds1_end;
		    var cdsLast_end = 0;
		    var cdsLast_start = 0;

		    if(cdsArray.length > 0 ){
			cds1_start = cdsArray[0].start;
			cds1_end = cdsArray[0].end;
			cdsLast_end = cdsArray[cdsArray.length-1].end;
			cdsLast_start = cdsArray[cdsArray.length-1].start;
		    }

		    if(strand == 1){

			adjusted_start_5prime = cds1_start - start_coord;
			window.orig_adjusted_start_5prime = adjusted_start_5prime;
			window.adjusted_start_5prime = window.orig_adjusted_start_5prime;

		    }else{

			adjusted_start_5prime = (end_coord - start_coord) - (cdsLast_end - start_coord)
			window.orig_adjusted_start_5prime = adjusted_start_5prime;
			window.adjusted_start_5prime = window.orig_adjusted_start_5prime;
		    }

		    //3' UTR coordinates
		    var exon_last_i = exonArray.length - 1;
		    var adjusted_start_3prime = 0;
		    var adjusted_end_3prime = 0;

		    if(strand == 1){
			//forward strand
			adjusted_end_3prime = cdsLast_end - start_coord - 3;
			window.orig_adjusted_end_3prime = adjusted_end_3prime;
			window.adjusted_end_3prime = window.orig_adjusted_end_3prime;

		    }else{
			//negative strand
			adjusted_end_3prime = (end_coord - start_coord) - (cds1_start - start_coord) - 3;
			window.orig_adjusted_end_3prime = adjusted_end_3prime;
			window.adjusted_end_3prime = window.orig_adjusted_end_3prime;
		    }

		    start_seq = targetSeq.substr(window.orig_adjusted_start_5prime,3);
		    end_seq = targetSeq.substr(window.orig_adjusted_end_3prime,3);

		    highlightExons(BioJsObject,legend_container,exonArray,utrArray,start_coord,end_coord,targetSeq);
		    highlightUtrs(BioJsObject,legend_container,utrArray,start_coord,end_coord,targetSeq);
		    highlightIntrons(BioJsObject,legend_container,intronArray,start_coord,end_coord,targetSeq);
		    reverseComplement(BioJsObject,legend_container,targetSeq,revseq);
		    annotateStartStop(BioJsObject,legend_container,targetSeq.length,start_seq,end_seq);
		    resetSequence(BioJsObject,legend_container,seq,targetSeqLen,exonArray,intronArray,utrArray,start_coord,end_coord,targetSeq,strand);
		    downloadButton(BioJsObject,legend_container,container);
		})
	    );
	}
    }));
}


/**
 * Description
 * @param {String}
 * @returns {String}
 */
function downloadButton(BioJsObject,legend_container, container){

    var instruct_text = dojo.create('div',{className:'DownloadText', innerHTML: '<a href="Javascript:DownloadText()"><img src="plugins/SeqLighter/img/qmark.jpg"></a>&nbsp;<span style="color:#000080"><b>To download:</b></span>  '}, legend_container );

    var downloadSelect = new dijit.form.Select({
        name: "DownloadSelect",
	id: "DownloadSelect",
        options: [
	    { label: "Select format", value: "none" , selected:true},
            { label: "PNG", value: "png" },
            { label: "JPEG", value: "jpeg"},
            { label: "SVG", value: "svg"}
        ]
    });
    downloadSelect.placeAt(instruct_text,"second");

    var formatType = 'none';
    var downloadLink = dojo.create('a',{className: 'downloadimg', id: 'downloadimg', href: '#', download: ''}, instruct_text);

    var canvas_container = dojo.create('canvas',{className: 'canvasContainer', id: 'canvasContainer', width: '850px', height: ''}, container );
    var canvas = document.getElementById("canvasContainer");

    downloadSelect.on("change", function(){

	formatType = this.get("value");

	var svgString = BioJsObject._drawSVG();
	var maxheight = BioJsObject._getmaxheight();
	var filename = window.featid + '_sequence.' + formatType;
	canvas.setAttribute('height',maxheight);
	downloadLink.setAttribute('download', filename);

	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() {
	    ctx.drawImage(img, 0, 0);

	    var imgtype = '';

	    if(formatType == 'png'){
		imgtype = canvas.toDataURL("image/png");
	    }else if (formatType == 'svg') {
		svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
		//convert svg source to URI data scheme.
		    imgtype = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svgString);
	    }else if (formatType == 'jpeg'){
		imgtype = canvas.toDataURL("image/jpg");
	    }

	    var button = document.getElementById('downloadimg');
	    button.href = imgtype;

	};
	img.src = url;

	if(formatType == 'none'){
	    dijit.byId("DownloadButton").setAttribute('disabled', true);

	}else{
	    dijit.byId("DownloadButton").setAttribute('disabled', false);
	}
    });

    var downloadButton = new dijit.form.ToggleButton({
	checked: false,
	iconClass: "dijitRadioIcon",
	id: "DownloadButton",
	disabled: true,
	onClick: function(){

	},
	label: "Download"
    }, "toggleButtonProgrammatic");
    downloadButton.placeAt(downloadLink,"second");
}


/**
 * Description
 * @param {String}
 * @returns {String}
 */
function reverseComplement(BioJsObject,legend_container,targetSeq,revseq){

    var revseqButton = new dijit.form.ToggleButton({
	checked: false,
	iconClass: "dijitRadioIcon",
	id: "doRevSeq",
	onClick: function(){

	    if(dijit.byId("doRevSeq").checked){

		//uncheck if checked
		dijit.byId("highlightExons").set('checked', false);
		dijit.byId("highlightIntrons").set('checked', false);
		dijit.byId("highlightUtrs").set('checked', false);
		dijit.byId("annotateSS").set('checked', false);

		//disable button
		dijit.byId("annotateSS").setAttribute('disabled', true);
		dijit.byId("highlightUtrs").setAttribute('disabled', true);
		dijit.byId("highlightIntrons").setAttribute('disabled', true);
		dijit.byId("highlightExons").setAttribute('disabled', true);

		BioJsObject.clearSequence("Reverse complement sequence...");
		var newid = window.featid + "_rev";
		BioJsObject.setSequence(revseq,newid);
	    }
	    else{

		dijit.byId("highlightExons").set('checked', false);
		dijit.byId("highlightIntrons").set('checked', false);
		dijit.byId("highlightUtrs").set('checked', false);
		dijit.byId("annotateSS").set('checked', false);

		//disable button
		dijit.byId("annotateSS").setAttribute('disabled', false);
		dijit.byId("highlightUtrs").setAttribute('disabled', false);
		dijit.byId("highlightIntrons").setAttribute('disabled', false);
		dijit.byId("highlightExons").setAttribute('disabled', false);

		BioJsObject.clearSequence("Reset to original target sequence...");
		BioJsObject.setSequence(targetSeq,window.featid);
	    }
	},
	label: "Reverse Comp"
    }, "toggleButtonProgrammatic");
    revseqButton.placeAt(legend_container,"second");
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function reverseComplement_flanking(BioJsObject,legend_container,targetSeq,revseq,newid_flanking,newid_flanking_rc){

     dijit.byId('doRevSeq').attr('onClick', function(){

	    if(dijit.byId("doRevSeq").checked){

		//uncheck if checked
		dijit.byId("highlightExons").set('checked', false);
		dijit.byId("highlightIntrons").set('checked', false);
		dijit.byId("highlightUtrs").set('checked', false);
		dijit.byId("annotateSS").set('checked', false);

		//disable button
		dijit.byId("annotateSS").setAttribute('disabled', true);
		dijit.byId("highlightUtrs").setAttribute('disabled', true);
		dijit.byId("highlightIntrons").setAttribute('disabled', true);
		dijit.byId("highlightExons").setAttribute('disabled', true);

		BioJsObject.clearSequence("Reverse complement sequence with flanking region...");
		BioJsObject.setSequence(revseq,newid_flanking_rc);
	    }
	    else{
		dijit.byId("highlightExons").set('checked', false);
		dijit.byId("highlightIntrons").set('checked', false);
		dijit.byId("highlightUtrs").set('checked', false);
		dijit.byId("annotateSS").set('checked', false);

		//enable button
		dijit.byId("annotateSS").setAttribute('disabled', false);
		dijit.byId("highlightUtrs").setAttribute('disabled', false);
		dijit.byId("highlightIntrons").setAttribute('disabled', false);
		dijit.byId("highlightExons").setAttribute('disabled', false);

		BioJsObject.clearSequence("Reset to original sequence with flanking region...");
		BioJsObject.setSequence(targetSeq,newid_flanking_rc);
	    }
	}
    );
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function resetSequence(BioJsObject,legend_container,seq,targetSeqLen,exonArray,intronArray,utrArray,start_coord,end_coord,targetSeq,strand){

    var instruct_text = dojo.create('div',{className:'FlankingText', innerHTML: '<a href="Javascript:flankingText()"><img src="plugins/SeqLighter/img/qmark.jpg"></a>&nbsp;<span style="color:#000080"><b>Add flanking region:</b></span>  '}, legend_container );

    var bufferValue = 0;

    var flankingRegionSelect = new dijit.form.Select({
        name: "FlankingRegion",
	id: "FlankingRegion",
        options: [
	    { label: "Select bufffer", value: "0" , selected:true},
            { label: "500 bp", value: "500" },
            { label: "1000 bp", value: "1000"},
            { label: "2000 bp", value: "2000" },
            { label: "3000 bp", value: "3000" },
            { label: "4000 bp", value: "4000" },
        ]
    });

    flankingRegionSelect.placeAt(instruct_text,"second");

    flankingRegionSelect.on("change", function(){

	bufferValue = this.get("value");

	window.adjusted_start_5prime = window.orig_adjusted_start_5prime + Number(bufferValue) ;
	window.adjusted_end_3prime = window.orig_adjusted_end_3prime + Number(bufferValue);

	var newSeq = seq.substr((4000-bufferValue),(targetSeqLen+(bufferValue*2)));
	var start_seq = seq.substr((0+4000-bufferValue),3);
	var end_seq = seq.substr((4000+targetSeqLen+bufferValue)-3,3);

	//uncheck if checked
	dijit.byId("highlightExons").set('checked', false);
	dijit.byId("highlightIntrons").set('checked', false);
	dijit.byId("highlightUtrs").set('checked', false);
	dijit.byId("annotateSS").set('checked', false);
	dijit.byId("doRevSeq").set('checked', false);

	BioJsObject.clearSequence("Loading new sequence selection...");
	var newid_flanking = window.featid + "_" + bufferValue + "bp";
	BioJsObject.setSequence(newSeq,newid_flanking);

	var revseq = revcom(newSeq);
	var newid_flanking_rc = window.featid + "_" + bufferValue + "bp" + "_rc";
	reverseComplement_flanking(BioJsObject,legend_container,newSeq,revseq,newid_flanking,newid_flanking_rc);

	//update button values for addition of flanking region
	highlightExons_flanking( BioJsObject, legend_container, exonArray, utrArray,start_coord, end_coord, newSeq, bufferValue);
	highlightIntrons_flanking( BioJsObject, legend_container, intronArray, start_coord, end_coord, newSeq, bufferValue);
	highlightUtrs_flanking( BioJsObject, legend_container, utrArray, start_coord, end_coord, newSeq, bufferValue);
	annotateStartStop_flanking( BioJsObject, legend_container, newSeq, strand);

	var flanking_start = targetSeqLen + Number(bufferValue) + 1;
	var flanking_end = flanking_start + Number(bufferValue);

	BioJsObject.addHighlight( { "start": 1, "end": bufferValue, "color": "white", "background": "#A8A8A8", "id": "flanking5prime" } );
	BioJsObject.addHighlight( { "start": flanking_start, "end": flanking_end, "color": "white", "background": "#A8A8A8", "id": "flanking3prime" } );
    })
}

/**
 * Complement a sequence and reverse).
 * @param {String} seqString sequence
 * @returns {String} reverse complementedsequence
 */
function revcom(seq) {

    var compl_rx   = /[ACGT]/gi;
    var compl_tbl  = {"S":"S","w":"w","T":"A","r":"y","a":"t","N":"N","K":"M","x":"x","d":"h","Y":"R","V":"B","y":"r","M":"K","h":"d","k":"m","C":"G","g":"c","t":"a","A":"T","n":"n","W":"W","X":"X","m":"k","v":"b","B":"V","s":"s","H":"D","c":"g","D":"H","b":"v","R":"Y","G":"C"};

    var nbsp = String.fromCharCode(160);
    var compl_func = function(m) { return compl_tbl[m] || nbsp; };

    var compl_seq = seq.replace( compl_rx, compl_func );
    var revseq = compl_seq.split('').reverse().join('');

    return revseq;
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function showThis(theSequence,id){

    var mySequence = new Biojs.Sequence({
	sequence : theSequence,
	target : "test_mk1",
	format : 'CODATA',
	id : id,
        annotations: [],
	highlights : []
    });

    return mySequence;
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function highlightUtrs(BioJsObject,legend_container,utrArray,featStart,featEnd,targetSeq){

    var showUtrButton = new dijit.form.ToggleButton({
	checked: false,
	iconClass: "dijitRadioIcon",
	id: "highlightUtrs",
	onClick: function(){
	    if(dijit.byId("highlightUtrs").checked){

		for (var i = 0; i < utrArray.length; i++) {

		    var adjusted_start = 0;
		    var adjusted_end = 0;

		    if(utrArray[i].strand == 1){

			adjusted_start = utrArray[i].start - featStart + 1;
			adjusted_end = utrArray[i].end - featStart;

		    }else{

			adjusted_start = (featEnd - featStart) - (utrArray[i].end - featStart) + 1;
			adjusted_end = (featEnd - featStart) - (utrArray[i].start - featStart);
		    }

		    BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#FFA366", "id": "utr"+i } );
		}
	    }
	    else{

		for (var i = 0; i < utrArray.length; i++) {

		    BioJsObject.removeHighlight("utr"+i);
		}
	    }
	},
	label: "Highlight UTRs"
    }, "toggleButtonProgrammatic");
    showUtrButton.placeAt(legend_container,"second");
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function highlightUtrs_flanking(BioJsObject,legend_container,utrArray,featStart,featEnd,newSeq, bufferValue){

    dijit.byId('highlightUtrs').attr('onClick',function(){
	if(dijit.byId("highlightUtrs").checked){

	    for (var i = 0; i < utrArray.length; i++) {

		var adjusted_start = 0;
		var adjusted_end = 0;

		    if(utrArray[i].strand == 1){

			adjusted_start = utrArray[i].start - featStart + 1 + Number(bufferValue);
			adjusted_end = utrArray[i].end - featStart + Number(bufferValue);

		    }else{

			adjusted_start = (featEnd - featStart) - (utrArray[i].end - featStart) + 1 + Number(bufferValue);
			adjusted_end = (featEnd - featStart) - (utrArray[i].start - featStart) + Number(bufferValue);
		    }

		BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#FFA366", "id": "utr"+i } );
	    }
	}
	else{
	    for (var i = 0; i < utrArray.length; i++) {

		BioJsObject.removeHighlight("utr"+i);
	    }
	}
    }
 );

}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function highlightExons(BioJsObject,legend_container,exonArray,utrArray,featStart,featEnd,targetSeq){

    var showExonButton = new dijit.form.ToggleButton({
	checked: false,
	iconClass: "dijitRadioIcon",
	id: "highlightExons",
	onClick: function(){
	    if(dijit.byId("highlightExons").checked){

		//remove the following highlights first if enabled
		if(dijit.byId("highlightUtrs").checked){
		    for (var i = 0; i < utrArray.length; i++) {
			BioJsObject.removeHighlight("utr"+i);
		    }
		}
		if(dijit.byId("annotateSS").checked){
		    BioJsObject.removeHighlight("Start");
		    BioJsObject.removeHighlight("Stop");
		}

		for (var i = 0; i < exonArray.length; i++) {

		    var adjusted_start = 0;
		    var adjusted_end = 0;

		    if(exonArray[i].strand == 1) {
			adjusted_start = exonArray[i].start - featStart + 1;
			adjusted_end = exonArray[i].end - featStart;
		    }else{
			adjusted_start = (featEnd - featStart) - (exonArray[i].end - featStart) + 1;
			adjusted_end = (featEnd - featStart) - (exonArray[i].start - featStart);
		    }

		    BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#5CBEFF", "id": "exon"+i } )
		}

		//add back the higlights for Utrs and/or Start/Stop
	    	if(dijit.byId("highlightUtrs").checked){

		    for (var i = 0; i < utrArray.length; i++) {

			var adjusted_start = 0;
			var adjusted_end = 0;

			if(utrArray[i].strand == 1){

			    adjusted_start = utrArray[i].start - featStart + 1;
			    adjusted_end = utrArray[i].end - featStart;

			}else{

			    adjusted_start = (featEnd - featStart) - (utrArray[i].end - featStart) + 1;
			    adjusted_end = (featEnd - featStart) - (utrArray[i].start - featStart);
			}

			BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#FFA366", "id": "utr"+i } );
		    }
		}

		if(dijit.byId("annotateSS").checked){
		    BioJsObject.addHighlight( { "start": window.start_beg, "end": window.start_end, "color": "white", "background": "green", "id": "Start" } );
		    BioJsObject.addHighlight( { "start": window.stop_beg, "end": window.stop_end, "color": "white", "background": "red", "id": "Stop" } );
		}
	    }
	    else{
		for (var i = 0; i < exonArray.length; i++) {
		    BioJsObject.removeHighlight("exon"+i);
		}
	    }
	},
	label: "Highlight Exons"
    }, "toggleButtonProgrammatic");
    showExonButton.placeAt(legend_container,"second");
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function highlightExons_flanking(BioJsObject,legend_container,exonArray,utrArray,featStart,featEnd,newSeq,bufferValue,newid_flanking){

     dijit.byId('highlightExons').attr('onClick', function(){
	    if(dijit.byId('highlightExons').checked){

		//remove the following highlights first if enabled
		if(dijit.byId("highlightUtrs").checked){
		    BioJsObject.removeHighlight("5primeUtr");
		    BioJsObject.removeHighlight("3primeUtr");
		}
		if(dijit.byId("annotateSS").checked){
		    BioJsObject.removeHighlight("Start");
		    BioJsObject.removeHighlight("Stop");
		}

		for (var i = 0; i < exonArray.length; i++) {

		    var adjusted_start = 0;
		    var adjusted_end = 0;

		    if(exonArray[i].strand == 1) {
			adjusted_start = exonArray[i].start - featStart + 1 + Number(bufferValue);
			adjusted_end = exonArray[i].end - featStart + Number(bufferValue) ;
		    }else{
			adjusted_start = (featEnd - featStart) - (exonArray[i].end - featStart) + 1 + Number(bufferValue);
			adjusted_end = (featEnd - featStart) - (exonArray[i].start - featStart) + Number(bufferValue);
		    }

		    BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#5CBEFF", "id": "exon"+i } )
		}

		//add back highlights for Utrs and/or Start/Stop
		if(dijit.byId("highlightUtrs").checked){

		    for (var i = 0; i < utrArray.length; i++) {

			var adjusted_start = 0;
			var adjusted_end = 0;

			if(utrArray[i].strand == 1){

			    adjusted_start = utrArray[i].start - featStart + 1 + Number(bufferValue);
			    adjusted_end = utrArray[i].end - featStart + Number(bufferValue);

			}else{

			    adjusted_start = (featEnd - featStart) - (utrArray[i].end - featStart) + 1 + Number(bufferValue);
			    adjusted_end = (featEnd - featStart) - (utrArray[i].start - featStart) + Number(bufferValue);
			}

			BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#FFA366", "id": "utr"+i } );
		    }
		}

		if(dijit.byId("annotateSS").checked){
		    BioJsObject.addHighlight( { "start": window.start_beg, "end": window.start_end, "color": "white", "background": "green", "id": "Start" } );
		    BioJsObject.addHighlight( { "start": window.stop_beg, "end": window.stop_end, "color": "white", "background": "red", "id": "Stop" } );
		}
	    }
	 else{
	     for (var i = 0; i < exonArray.length; i++) {
		 BioJsObject.removeHighlight("exon"+i);
	     }
	 }
     });
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function highlightIntrons(BioJsObject,legend_container,intronArray,featStart,featEnd,targetSeq){

    var showIntronButton = new dijit.form.ToggleButton({
	checked: false,
	iconClass: "dijitRadioIcon",
	id: "highlightIntrons",
	onClick: function(){
	    var IDS = new Array();

	    if(dijit.byId("highlightIntrons").checked){

		for (var i = 0; i < intronArray.length; i++) {

		    var adjusted_start = 0;
		    var adjusted_end = 0;

		    if(intronArray[i].strand == 1){

			adjusted_start = intronArray[i].start - featStart + 1;
			adjusted_end = intronArray[i].end - featStart;

		    }else{

			adjusted_start = (featEnd - featStart) - (intronArray[i].end - featStart) + 1;
			adjusted_end = (featEnd - featStart) - (intronArray[i].start - featStart);
		    }

		    BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#B1D864", "id": "intron"+i } );
		}
	    }
	    else{
		for (var i = 0; i < intronArray.length; i++) {
		    BioJsObject.removeHighlight("intron"+i);
		}
	    }
	},
	label: "Highlight Introns"
    }, "toggleButtonProgrammatic");
    showIntronButton.placeAt(legend_container,"second");
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function highlightIntrons_flanking(BioJsObject,legend_container,intronArray,featStart,featEnd,newSeq,bufferValue,newid_flanking){

     dijit.byId('highlightIntrons').attr('onClick', function(){
	    var IDS = new Array();

	    if(dijit.byId("highlightIntrons").checked){

		for (var i = 0; i < intronArray.length; i++) {

		    var adjusted_start;
		    var adjusted_end;

		    if(intronArray[i].strand == 1){

			adjusted_start = intronArray[i].start - featStart + 1 + Number(bufferValue);
			adjusted_end = intronArray[i].end - featStart + Number(bufferValue);

		    }else{

			adjusted_start = (featEnd - featStart) - (intronArray[i].end - featStart) + 1 + Number(bufferValue);
			adjusted_end = (featEnd - featStart) - (intronArray[i].start - featStart) + Number(bufferValue);
		    }

		    BioJsObject.addHighlight( { "start": adjusted_start, "end": adjusted_end, "color": "white", "background": "#B1D864", "id": "intron"+i } );
		}
	    }
	    else{
		for (var i = 0; i < intronArray.length; i++) {
		    BioJsObject.removeHighlight("intron"+i);
		}
	    }
	}
    );
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function annotateStartStop( BioJsObject,legend_container,seqlen,start_seq,end_seq){

    var start_beg = window.orig_adjusted_start_5prime+1;
    var start_end = start_beg + 2;
    var stop_beg = window.orig_adjusted_end_3prime+1;
    var stop_end = stop_beg + 2;

    window.start_beg = start_beg;
    window.start_end = start_end;
    window.stop_beg = stop_beg;
    window.stop_end = stop_end;

    var showStartStopButton = new dijit.form.ToggleButton({
	checked: false,
	iconClass: "dijitRadioIcon",
	id: "annotateSS",
	onClick: function(){
	    var IDS = new Array();

	    if(dijit.byId("annotateSS").checked){
		if(start_seq == 'ATG'){

		    BioJsObject.addHighlight( { "start": start_beg, "end": start_end, "color": "white", "background": "green", "id": "Start" } );
		}

		if(end_seq == 'TAA' || end_seq == 'TGA' || end_seq == 'TAG'){

		    BioJsObject.addHighlight( { "start": stop_beg, "end": stop_end, "color": "white", "background": "red", "id": "Stop" } );

		}
	    }
	    else{
		BioJsObject.removeHighlight("Start");
		BioJsObject.removeHighlight("Stop");
	    }
	},
	label: "Show Start/Stop"
    }, "toggleButtonProgrammatic");
    showStartStopButton.placeAt(legend_container,"second");
}

/**
 * Description
 * @param {String}
 * @returns {String}
 */
function annotateStartStop_flanking( BioJsObject,legend_container,newSeq,strand){

    var start_beg = window.adjusted_start_5prime+1;
    var start_end = start_beg + 2;
    var stop_beg = window.adjusted_end_3prime+1;
    var stop_end = stop_beg + 2;

    window.start_beg = start_beg;
    window.start_end = start_end;
    window.stop_beg = stop_beg;
    window.stop_end = stop_end;

    start_seq = newSeq.substr(window.adjusted_start_5prime,3);
    end_seq = newSeq.substr(window.adjusted_end_3prime,3);

    dijit.byId('annotateSS').attr('onClick',function(){
	var IDS = new Array();

	if(dijit.byId("annotateSS").checked){
	    if(start_seq == 'ATG'){

		BioJsObject.addHighlight( { "start": start_beg, "end": start_end, "color": "white", "background": "green", "id": "Start" } );
	    }

	    if(end_seq == 'TAA' || end_seq == 'TGA' || end_seq == 'TAG'){

		BioJsObject.addHighlight( { "start": stop_beg, "end": stop_end, "color": "white", "background": "red", "id": "Stop" } );

	    }
	}
	else{
	    BioJsObject.removeHighlight("Start");
	    BioJsObject.removeHighlight("Stop");
	}
    }
  );
}
