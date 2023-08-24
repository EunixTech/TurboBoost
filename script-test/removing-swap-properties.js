function removeFontDisplay(cssContent) {  return cssContent.replace(/(font-display\s*:\s*[^;]+;)/g, ''); }

const inputCss = `
/*------------------------------------------------------------------
Project:
Version:
Last change:
Assigned to:  Le Xuan Bach
Primary use:  Company
-------------------------------------------------------------------*/
/*------------------------------------------------------------------
[LAYOUT]

* body
  + Header / header
  + Page Content / .page-content .name-page
        + Section Layouts / section .name-section
        ...
  + Footer / footer

-------------------------------------------------------------------*/
/*------------------------------------------------------------------
[COLOR CODES]

# Text Color      :
# Primary Color 01:
# Primary Color 02:
# Primary Color 03:

------------------------------------------------------------------*/
/*------------------------------------------------------------------
[TYPOGRAPHY]

Body            : 16px/1.6 '', Arial, sans-serif;
Title           : 18px/1.6 '', Arial, sans-serif;
Paragrap        : 18px/1.6 '', Arial, sans-serif;
Input, textarea : 14px/1.6 '', Arial, sans-serif;
-------------------------------------------------------------------*/



/*[ FONT ]
///////////////////////////////////////////////////////////
*/

@font-face {
  font-family: Montserrat-Regular;
  src: url('{{ 'Montserrat-Regular.ttf' | asset_url }}');
  font-display: display;
}

@font-face {
  font-family: Montserrat-Medium;
  src: url('{{ 'Montserrat-Medium.ttf' | asset_url }}');
}

@font-face {
  font-family: Montserrat-Bold;
  src: url('{{ 'Montserrat-Bold.ttf' | asset_url }}');
}

@font-face {
  font-family: Montserrat-Italic;
  src: url('{{ 'Montserrat-Italic.ttf' | asset_url }}');
}

@font-face {
  font-family: Montserrat-Black;
  src: url('{{ 'Montserrat-Black.ttf' | asset_url }}');
}

@font-face {
  font-family: Linearicons;
  src: url('{{ 'Linearicons-Free.ttf' | asset_url }}');
}

@font-face {
  font-family: Poppins-Bold;
  src: url('{{ 'Poppins-Bold.ttf' | asset_url }}');
}

@font-face {
  font-family: Poppins-Black;
  src: url('{{ 'Poppins-Black.ttf' | asset_url }}');
}

/*[ RESTYLE TAG ]
///////////////////////////////////////////////////////////
*/
* {
	margin: 0px;
	padding: 0px;
	box-sizing: border-box;
}

body, html {
	height: 100%;
	font-family: Montserrat-Regular, sans-serif;
  font-weight: 400;
}

/* ------------------------------------ */
a {
	font-family: Montserrat-Regular;
  font-weight: 400;
	font-size: 15px;
	line-height: 1.7;
	color: #666666;
	margin: 0px;
	transition: all 0.4s;
	-webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

a:focus {
	outline: none !important;
}

a:hover {
	text-decoration: none;
	color: {{ settings.color_skin }};
}

/* ------------------------------------ */
h1,h2,h3,h4,h5,h6 {
	margin: 0px;
}

p {
	font-family: Montserrat-Regular;
	font-size: 15px;
	line-height: 1.7;
	color: #888888;
	margin: 0px;
}

ul, li {
	margin: 0px;
	list-style-type: none;
}


/* ------------------------------------ */
input {
	outline: none;
	border: none !important;
}

textarea {
  outline: none;
}

/* textarea:focus, input:focus {
  border-color: transparent !important;
} */

input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; }
input:focus::-moz-placeholder { color:transparent; }
input:focus:-ms-input-placeholder { color:transparent; }

textarea:focus::-webkit-input-placeholder { color:transparent; }
textarea:focus:-moz-placeholder { color:transparent; }
textarea:focus::-moz-placeholder { color:transparent; }
textarea:focus:-ms-input-placeholder { color:transparent; }

/* ------------------------------------ */
button {
	outline: none !important;
	border: none;
	background: transparent;
}

button:hover {
	cursor: pointer;
}

iframe {
	border: none !important;
}


/* ------------------------------------ */
.container {
	max-width: 1200px;
}

.slick-slide {
  outline: none !important;
}





/*[ LOADDING ]
///////////////////////////////////////////////////////////
*/
.animsition-loading-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

[data-loader='ball-scale'] {
    width: 50px;
    height: 50px;
    -webkit-animation: ball-scale infinite linear .75s;
    -moz-animation: ball-scale infinite linear .75s;
    -o-animation: ball-scale infinite linear .75s;
    animation: ball-scale infinite linear .75s;
    border-radius: 100%;
    background-color: {{ settings.color_skin }};
}

@-webkit-keyframes ball-scale {
    0% {
        -webkit-transform: scale(.1);
        -ms-transform: scale(.1);
        -o-transform: scale(.1);
        transform: scale(.1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}

@-moz-keyframes ball-scale {
    0% {
        -webkit-transform: scale(.1);
        -ms-transform: scale(.1);
        -o-transform: scale(.1);
        transform: scale(.1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}

@-o-keyframes ball-scale {
    0% {
        -webkit-transform: scale(.1);
        -ms-transform: scale(.1);
        -o-transform: scale(.1);
        transform: scale(.1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}

@keyframes ball-scale {
    0% {
        -webkit-transform: scale(.1);
        -ms-transform: scale(.1);
        -o-transform: scale(.1);
        transform: scale(.1);
        opacity: 1;
    }

    100% {
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}

/*[ BACK TO TOP ]
///////////////////////////////////////////////////////////
*/
.btn-back-to-top {
  display: none;
  position: fixed;
  width: 40px;
  bottom: 15px;
  right: 15px;
  right: 40px;
  background-color: black;
  opacity: 0.5;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 4px;
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

.symbol-btn-back-to-top {
  font-size: 22px;
  color: white;
  line-height: 1em;
}

.btn-back-to-top:hover {
  opacity: 1;
  cursor: pointer;
}

@media (max-width: 576px) {
  .btn-back-to-top {
    bottom: 15px;
    right: 15px;
  }
}


/*[ Fixed search bar ]
///////////////////////////////////////////////////////////
*/
.fixed-search-bar {
	position: fixed;
	right: 68px;
	bottom: 13px;
	width: 200px;
}

.fixed-search-bar input {
	height: 40px;
}

@media (max-width: 576px) {
	.fixed-search-bar {
		right: 50%;
		margin-right: -100px;
	}
  }

/*[ Restyle Select2 ]
///////////////////////////////////////////////////////////
*/
/* Select2 */
.select2-container {
  display: block;
  max-width: 100% !important;
  width: auto !important;
}

.select2-container .select2-selection--single {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  height: 20px;
  outline: none;
  position: relative;
}

/* in select */
.select2-container .select2-selection--single .select2-selection__rendered {
  font-size: 13px;
  font-family: Montserrat-Regular;
  line-height: 20px;
  color: {{ settings.color_top_header_label }};
  padding-left: 0px ;
  background-color: transparent;
}

.select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 20px;
  top: 50%;
  transform: translateY(-50%);
  right: 0px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.select2-selection__arrow b {
  display: none;
}

.select2-selection__arrow:after {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  background-color: transparent;
  border-right: 1px solid #888888;
  border-bottom: 1px solid #888888;
  color: white;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  margin-bottom: 2px;
  margin-right: 8px;
}

/* dropdown option */
.select2-container--open .select2-dropdown {
  z-index: 1251;
  border: 1px solid #e5e5e5;
  border-radius: 0px;
  background-color: white;
}

.select2-container .select2-results__option[aria-selected] {
  padding-top: 5px;
  padding-bottom: 5px;
}

.select2-container .select2-results__option[aria-selected="true"] {
  background-color: {{ settings.color_skin }};
  color: white;
}

.select2-container .select2-results__option--highlighted[aria-selected] {
  background-color: {{ settings.color_skin }};
  color: white;
}

.select2-results__options {
  font-size: 13px;
  font-family: Montserrat-Regular;
  color: #888888;
}

.select2-search--dropdown .select2-search__field {
  border: 1px solid #aaa;
  outline: none;
  font-family: Montserrat-Regular;
  font-size: 13px;
  color: #888888;
}

/*[ rs1-select2 ]
-----------------------------------------------------------
*/
.rs1-select2 .select2-container {
  margin-left: 26px;
}

.rs1-select2 .select2-container .select2-selection--single {
  height: 20px;;
}

/*[ rs2-select2 ]
-----------------------------------------------------------
*/
.rs2-select2 .select2-container .select2-selection--single {
  background-color: white;
  height: 50px;
}

.rs2-select2 .select2-container .select2-selection--single .select2-selection__rendered {
  line-height: 20px;
  color: #555555;
  padding-left: 22px ;
}

.rs2-select2 .select2-container--default .select2-selection--single .select2-selection__arrow {
  right: 10px;
}

#dropDownSelect2 .select2-results__options {
  color: #555555;
}

#dropDownSelect2 .select2-search--dropdown .select2-search__field {
  color: #555555;
}



/*[ rs3-select2 ]
-----------------------------------------------------------
*/
.rs3-select2 .select2-container .select2-selection--single {
  height: 45px;
}

.rs3-select2 .select2-selection__arrow b {
  display: block;
}

.rs3-select2 .select2-selection__arrow:after {
  display: none;
}

/*[ rs4-select2 ]
-----------------------------------------------------------
*/
.rs4-select2 .select2-container .select2-selection--single {
  height: 40px;
}

.rs4-select2 .select2-container .select2-selection--single .select2-selection__rendered {
  padding-left: 15px ;
}

.rs4-select2 .select2-container--default .select2-selection--single .select2-selection__arrow {
  right: 5px;
}


/*[ Header ]
///////////////////////////////////////////////////////////
*/
.header1 {
  height: 125px;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.fixed-header {height: 110px;}


/*[ Header Desktop ]
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

.container-menu-header {
  width: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1100;
  box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -webkit-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -o-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -ms-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
}

/*[ Top bar ]
===========================================================*/
.topbar {
  height: 45px;
  background-color: {{ settings.color_top_header }};
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
}


/* ------------------------------------ */

.topbar-social {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  padding-left: 40px;
}

.topbar-social-item {
  font-size: 18px;
  color: {{ settings.color_top_header_label }};
  padding: 10px;
}

/* ------------------------------------ */
.topbar-email,
.topbar-child1 {
  font-family: Montserrat-Regular;
  font-size: 13px;
  color: {{ settings.color_top_header_label }};
  line-height: 1.7;
}

/* ------------------------------------ */
.topbar-child2 {
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-right: 38px;
}


/*[ Menu ]
===========================================================*/
.wrap_header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 80px;
  background-color: {{ settings.color_center_header }};
  justify-content: center;
  align-items: center;
  position: relative;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.fixed-header .wrap_header {
  height: 65px;
}


/*[ Logo ]
-----------------------------------------------------------*/
.logo {
  display: block;
  position: absolute;
  left: 52px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
}

.logo img {
  max-height: 27px;
}


/*[ Menu ]
-----------------------------------------------------------*/
.main_menu {
  list-style-type: none;
  margin: 0px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.main_menu > li {
  display: block;
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
}

.main_menu > li > a {
  font-family: Montserrat-Regular;
  font-size: 15px;
  color: {{ settings.color_menu_links }};
  padding: 0;
  border-bottom: 1px solid transparent;
}

li.sale-noti > a {
  color: {{ settings.color_skin }};
}

.main_menu > li:hover > a {
  text-decoration: none;
  border-bottom: 1px solid #333333;
}

.main_menu li {
  position: relative;
}

.main_menu > li:hover > .sub_menu {
  visibility: visible;
  opacity: 1;
}

.sub_menu {
  list-style-type: none;
  position: absolute;
  z-index: 1100;
  top:0;
  left:100%;
  width: 225px;
  background-color: #222222;
  opacity: 0;
  visibility: hidden;
  padding-top: 10px;
  padding-bottom: 10px;
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

.main_menu > li > .sub_menu {
  top:100%;
  left: 0;
  position: absolute;
}

.sub_menu li:hover > .sub_menu {
  visibility: visible;
  opacity: 1;
}

.sub_menu li {
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  -moz-transition: all 0.3s;
}

.sub_menu li, .sub_menu a {
  padding: 10px;
  font-family: Montserrat-Regular;
  font-size: 13px;
  color: white;
}

.sub_menu > li:hover > a {
  color: {{ settings.color_skin }};
  text-decoration: none;
}

/* ------------------------------------ */
.header-icons {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  right: 52px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
}

.header-wrapicon1,
.header-wrapicon2 {
  height: 27px;
  position: relative;
}

.header-wrapicon1 img,
.header-wrapicon2 img {
  height: 100%;
}

.header-icon1:hover,
.header-icon2:hover {
  cursor: pointer;
}

.header-icons-noti {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #111111;
  color: white;
  font-family: Montserrat-Medium;
  font-size: 12px;
  position: absolute;
  top: 0;
  right: -10px;
}

.linedivide1 {
  display: block;
  height: 20px;
  width: 1px;
  background-color: #e5e5e5;
  margin-left: 23px;
  margin-right: 23px;
  margin-top: 5px;
}

/*[ Header cart ]
-----------------------------------------------------------
*/
.header-cart {
  position: absolute;
  z-index: 1100;
  width: 339px;
  top: 190%;
  right: -10px;
  padding: 20px;
  border-top: 3px solid #e6e6e6;
  background-color: white;

  box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);

  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  -moz-transition: all 0.3s;

  transform-origin: top right;
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
}

.show-header-dropdown {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}

.fixed-header .header-cart {
  top: 160%;
}

.header-cart-wrapitem {
  max-height: 270px;
  overflow: auto;
}

.header-cart-item {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 5px;
  padding-top: 5px;
}

/* ------------------------------------ */
.header-cart-item-img {
  width: 80px;
  position: relative;
  margin-right: 20px;
}

.header-cart-item-img img {
  width: 100%;
}

.header-cart-item-img::after, .btn-remove i::after {
  content: '\e870';
  font-family: Linearicons;
  font-size: 16px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  color: white;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  -moz-transition: all 0.3s;
  opacity: 0;
}

.header-cart-item-img:hover:after {
  cursor: pointer;
  opacity: 1;
}

/* ------------------------------------ */
.header-cart-item-txt {
  width: calc(100% - 100px);
}

.header-cart-item-name {
  display: block;
  font-family: Montserrat-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.3;
  margin-bottom: 12px;
}

.header-cart-item-info {
  display: block;
  font-family: Montserrat-Regular;
  font-size: 12px;
  color: #888888;
  line-height: 1.5;
}

.header-cart-total {
  font-family: Montserrat-Regular;
  font-size: 15px;
  color: #555555;
  line-height: 1.3;
  text-align: right;
  padding-top: 15px;
  padding-bottom: 25px;
  padding-right: 3px;
}
/* ------------------------------------ */
.header-cart-buttons {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.header-cart-wrapbtn {
  width: calc((100% - 10px) / 2);
}


.header-dropdwn {
  position: absolute;
  z-index: 1100;
  width: 250px;
  top: 190%;
  right: 0px;
  padding: 20px;
  border-top: 3px solid #e6e6e6;
  background-color: white;
  box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s linear 0.3s;
  -webkit-transition: all 0.3s linear 0.1s;
  -o-transition: all 0.3s linear 0.1s;
  -moz-transition: all 0.3s linear 0.1s;
  transform-origin: top right;
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
}

.header-icons3 .header-dropdwn {
	top: 90px;
	left: 0;
	transform-origin: top left;
}

.header-dropdwn a{
	display: inline-block;
	width: 100%;
}

.header-wrapicon1:hover + .header-dropdwn,
.header-dropdwn:hover {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}


/*[ Header Mobile ]
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
.wrap_header_mobile {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: {{ settings.color_center_header }};
  display: none;
}

/*[ Logo mobile ]
-----------------------------------------------------------*/
.logo-mobile {
  display: block;
}

.logo-mobile img {
  max-height: 27px;
}

/*[ btn show menu ]
-----------------------------------------------------------*/
.btn-show-menu {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.btn-show-menu:only-child {
	width: 100%;
	justify-content: flex-end;
}

.hamburger {
  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  -ms-transform: scale(0.8);
  -o-transform: scale(0.8);
  transform: scale(0.8);
  margin-top: 5px;
}


/*[ Header icon mobile ]
-----------------------------------------------------------*/
.header-icons-mobile {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  margin-right: 15px;
  position: relative;
}
.linedivide2 {
  display: block;
  height: 20px;
  width: 1px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
}

.header-icons-mobile .header-cart {
  width: 300px;
  bottom: -10px;
  left: auto;
  right: 0;
  z-index: 1100;
  transform-origin: top right;
  top: auto;
  transform: translateY( 100% ) scale(0);
}
.header-icons-mobile .header-cart.show-header-dropdown {
  -webkit-transform: translateY( 100% ) scale(1);
  -moz-transform: translateY( 100% ) scale(1);
  -ms-transform: translateY( 100% ) scale(1);
  -o-transform: translateY( 100% ) scale(1);
  transform: translateY( 100% ) scale(1);
}

/*[ Menu mobile ]
-----------------------------------------------------------*/
.wrap-side-menu {
  width: 100%;
  background-color: white;
  display: none;
  border-top: 1px solid #ececec;
}

.side-menu {
  width: 100%;
}

.side-menu li {
  list-style-type: none;
}

.side-menu .main-menu {margin-bottom: 0;}

.item-menu-mobile {
  background-color: {{ settings.color_skin }};
}

.side-menu .main-menu > li > a {
  padding-left: 20px;
  font-family: Montserrat-Regular;
  font-size: 15px;
  color: white;
  line-height: 2.86;
}

.side-menu .main-menu > li {
  color: white;
  position: relative;
}


.side-menu .main-menu .arrow-main-menu {
  font-size: 14px;
  position: absolute;
  right: 20px;
  top: 5px;
  padding: 10px;
  -webkit-transition: all 0.4s !important;
  -o-transition: all 0.4s !important;
  -moz-transition: all 0.4s !important;
  transition: all 0.4s !important;
}

.side-menu .main-menu .arrow-main-menu:hover {
  cursor: pointer;
}

.turn-arrow {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.side-menu .sub-menu a {
  padding-left: 20px;
  font-family: Montserrat-Regular;
  font-size: 13px;
  color: #333333;
  line-height: 2.5;
}

.side-menu .sub-menu > li {
  padding-left: 12px;
  padding-top:
}

.side-menu .sub-menu a:hover {
  text-decoration: none;
  padding-left: 20px;
  color: {{ settings.color_skin }} !important;
}

.side-menu .sub-menu {
  background-color: white;
  display: none;
}

@media (min-width: 992px){
  .wrap-side-menu {
    display: none;
  }
}

/* ------------------------------------ */
.item-topbar-mobile {
  border-bottom: 1px solid #ececec;
}

.topbar-child2-mobile {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.topbar-social-moblie {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
}


/*[ Header2 ]
///////////////////////////////////////////////////////////
*/
.topbar2 {
  background-color: #fff;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ------------------------------------ */
.logo2 {
  display: block;
}

.logo2 img {
  max-height: 27px;
}

.fixed-header2 {
  z-index: 1300;
  position: fixed;
  height: 65px;
  left: 0;
  top: -70px;
  visibility: hidden;

  box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -webkit-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -o-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
  -ms-box-shadow: 0 1px 5px 0px rgba(0,0,0,0.2);
}

.fixed-header2 .header-cart {
  top: 160%;
}

.show-fixed-header2 {
  visibility: visible;
  top: 0px;
}


/*[ Header3 ]
///////////////////////////////////////////////////////////
*/
.container-menu-header-v3 {
  position: fixed;
  z-index: 1200;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 320px;
  height: 100vh;
  border-right: 1px solid #e5e5e7;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

/*[ Menu ]
===========================================================*/
.container-menu-header-v3 .wrap_header {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  background-color: white;
}


/*[ Logo ]
-----------------------------------------------------------*/
.container-menu-header-v3 .logo3 {
  display: block;
}

.container-menu-header-v3 .logo3 img {
  max-width: 120px;
}

/*[ Header Icon ]
-----------------------------------------------------------*/
.container-menu-header-v3 .header-icons3 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: relative;
}

/*[ Header cart ]
-----------------------------------------------------------
*/
.container-menu-header-v3 .header-cart {
  left: -10px;
  transform-origin: top left;
}

/*[ Menu ]
-----------------------------------------------------------*/
.container-menu-header-v3 .main_menu {
  list-style-type: none;
  margin: 0px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
}

.container-menu-header-v3 .main_menu > li {
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 0px;
  padding-right: 0px;
  text-align: center;
}

.container-menu-header-v3 .sub_menu {
  top:0;
  left:100%;
}

.container-menu-header-v3 .main_menu > li > .sub_menu {
  top: 10px;
  left: 95%;
}

.container-menu-header-v3 .sub_menu li {
  text-align: left;
}

.container-menu-header-v3 .topbar-social-item {
  padding: 10px 8px;
}


/*[ Page sidebar ]
-----------------------------------------------------------
*/
.container1-page {
  margin-left: 320px;
}

@media (max-width: 992px){
  .wrap_header_mobile {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex !important;
  }
  .wrap_header {display: none;}

  .container-menu-header-v3,
  .container-menu-header-v2,
  .container-menu-header
  {display: none;}

  .top-bar {display: none;}
  header {height: auto !important;}

  .container1-page {
    margin-left: 0px;
  }
}



/*[ Slide1 ]
///////////////////////////////////////////////////////////
*/

/*[ Slick1 ]
-----------------------------------------------------------
*/
.wrap-slick1 {
  position: relative;
}

.item-slick1 {
  height: 570px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.arrow-slick1 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: white;
  position: absolute;
  background-color: black;
  opacity: 0;

  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);

  border-radius: 50%;
  z-index: 200;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.wrap-slick1:hover .arrow-slick1 {
  opacity: 0.5;
}

.arrow-slick1:hover {
  background-color: {{ settings.color_skin }};
}

.next-slick1 {
  right: 50px;
  left: auto;
}

.prev-slick1 {
  left: 50px;
  right: auto;
}

@media (max-width: 576px) {
  .next-slick1 {
    right: 15px;
  }

  .prev-slick1 {
    left: 15px;
  }
}

/*[ Caption ]
-----------------------------------------------------------
*/
@media (max-width: 992px) {
  .wrap-content-slide1 .xl-text2 {
    font-size: 60px;
  }
}

@media (max-width: 768px) {
  .wrap-content-slide1 .xl-text3,
  .wrap-content-slide1 .xl-text2,
  .wrap-content-slide1 .xl-text1 {
    font-size: 50px;
  }

  .wrap-content-slide1 .m-text27,
  .wrap-content-slide1 .m-text1 {
    font-size: 16px;
  }

  .item-slick1 {
    height: 470px;
  }
}

@media (max-width: 576px) {
  .wrap-content-slide1 .xl-text3,
  .wrap-content-slide1 .xl-text2,
  .wrap-content-slide1 .xl-text1 {
    font-size: 40px;
  }

  .wrap-content-slide1 .m-text27,
  .wrap-content-slide1 .m-text1 {
    font-size: 16px;
  }

  .item-slick1 {
    height: 370px;
  }
}

/*[ rs1-slick1 ]
-----------------------------------------------------------
*/
.rs1-slick1 .item-slick1 {
  height: 100vh;
}

@media (max-width: 992px) {
  .rs1-slick1 .item-slick1 {
    height: calc(100vh - 85px);
  }
}




/*[ Slide2 ]
///////////////////////////////////////////////////////////
*/

/*[ Slick2 ]
-----------------------------------------------------------
*/
.wrap-slick2 {
  position: relative;
  margin-right: -15px;
  margin-left: -15px;
}

/* ------------------------------------ */
.arrow-slick2 {
  position: absolute;
  z-index: 100;
  top: calc((100% - 70px) / 2);
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 39px;
  color: #cccccc;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.arrow-slick2:hover {
  color: #666666;
}

.next-slick2 {
  right: -30px;
}

.prev-slick2 {
  left: -30px;
}

@media (max-width: 1280px) {
  .next-slick2 {
    right: 0px;
  }

  .prev-slick2 {
    left: 0px;
  }
}

@media (max-width: 1610px) {
  .rs1-slick2 .next-slick2 {
    right: 0px;
  }

  .rs1-slick2 .prev-slick2 {
    left: 0px;
  }
}

/*[ rs Sweetalert ]
///////////////////////////////////////////////////////////
*/
.swal-overlay {
    overflow-y: auto;
}

.swal-icon--success {
    border-color: #66a8a6;
}

.swal-icon--success__line {
    background-color: #66a8a6;
}

.swal-icon--success__ring {
    border: 4px solid rgba(102, 168, 166, 0.2);
}

.swal-button:focus {
    outline: none;
    box-shadow: none;
}

.swal-button {
    background-color: {{ settings.color_skin }};
    font-family: Montserrat-Regular;
    font-size: 15px;
    color: white;
    text-transform: uppercase;
    font-weight: unset;
    border-radius: 20px;
    -webkit-transition: all 0.3s;
    -o-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
}

.swal-button:hover {
    background-color: #333333;
}

.swal-button:active {
    background-color: {{ settings.color_skin }};
}

.swal-title {
  font-family: Montserrat-Medium;
  color: #333333;
  font-size: 16px;
  line-height: 1.5;
  padding: 0 15px;
}

.swal-text {
  font-family: Montserrat-Regular;
  color: #333333;
  font-size: 15px;
  text-align: center;
}

.swal-footer {
    margin-top: 0;
}


/*[ Block1 ]
///////////////////////////////////////////////////////////
*/
.block1-wrapbtn {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  transform: translateX(-50%);
  bottom: 20px;

  box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
}


/*[ Block2 ]
///////////////////////////////////////////////////////////
*/
.block2-labelsale::before,
.block2-labelnew::before
{
  z-index: 100;
  font-family: Montserrat-Regular;
  font-size: 12px;
  color: white;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 22px;
  border-radius: 11px;
  position: absolute;
  top: 12px;
  left: 12px;
}

.block2-labelsale::before {
  background-color: {{ settings.color_skin }};
  content: 'Sale';
}

.block2-labelnew::before {
  background-color: #66a8a6;
  content: 'New';
}

/* ------------------------------------ */
.block2-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: trasparent;
  opacity: 1;
}

@media (min-width: 481px) {
	.block2-overlay {
		background-color: rgba(0,0,0,0.4);
		opacity: 0;
	}
}

.block2-overlay__link {
	position:absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
}

/* ------------------------------------ */
.block2-btn-addcart {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  transform: translateX(-50%);
  bottom: 20px;
}

@media (min-width: 481px) {
	.block2-btn-addcart {
		bottom: -45px;
	}
}

/* ------------------------------------ */
.block2-btn-towishlist,
.block2-btn-addwishlist {
  display: block;
  position: absolute;
  top: 26px;
  right: 20px;
  font-size: 20px;
  color: white;
  line-height: 0;
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}

@media (min-width: 481px) {
	.block2-btn-towishlist,
	.block2-btn-addwishlist {
		-webkit-transform: scale(0);
		-moz-transform: scale(0);
		-ms-transform: scale(0);
		-o-transform: scale(0);
		transform: scale(0);
	}
}

.block2-btn-addwishlist:hover {
  color: white;
}

.block2-btn-addwishlist .icon-wishlist,
.block2-btn-towishlist .icon-wishlist {
  line-height: 0;
}

.block2-btn-addwishlist:hover .icon_heart_alt {
  display: none;
}

.block2-btn-addwishlist:hover .icon_heart {
  display: block;
}

/* ------------------------------------ */
.block2-btn-towishlist .icon_heart_alt {
  display: none;
}

.block2-btn-towishlist .icon_heart {
  display: block;
  color: {{ settings.color_skin }};
}

/* ------------------------------------ */
@media (min-width: 481px) {

	.block2-overlay:hover {
		opacity: 1;
	}

	.block2-overlay:hover .block2-btn-addcart {
		bottom: 20px;
	}

	.block2-overlay:hover .block2-btn-addwishlist,
	.block2-overlay:hover .block2-btn-towishlist{
		-webkit-transform: scale(1);
		-moz-transform: scale(1);
		-ms-transform: scale(1);
		-o-transform: scale(1);
		transform: scale(1);
	}

}


/*[ Block4 ]
///////////////////////////////////////////////////////////
*/
.block4 {
  position: relative;
  overflow: hidden;
  // width: calc(100% / 5);
}

@media (max-width: 1360px) {
  .block4 {
    // width: calc(100% / 4);
  }
}

@media (max-width: 1200px) {
  .block4 {
    // width: calc(100% / 3);
  }
}

@media (max-width: 992px) {
  .block4 {
    // width: calc(100% / 2);
  }
}

@media (max-width: 576px) {
  .block4 {
    // width: calc(100% / 1);
  }
}

/* ------------------------------------ */
@media (max-width: 1660px) {
  .rs1-block4 .block4 {
    // width: calc(100% / 4);
  }
}

@media (max-width: 1380px) {
  .rs1-block4 .block4 {
    // width: calc(100% / 3);
  }
}

@media (max-width: 1200px) {
  .rs1-block4 .block4 {
    // width: calc(100% / 2);
  }
}

@media (max-width: 576px) {
  .rs1-block4 .block4 {
    // width: calc(100% / 1);
  }
}

/* ------------------------------------ */
.block4-overlay {
  display: block;
  background-color: rgba(0,0,0,0.9);
  visibility: hidden;
  opacity: 0;
}

.block4-overlay:hover {
  color: unset;
}

/* ------------------------------------ */
.block4-overlay-txt {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -100%;
}

/* ------------------------------------ */
.block4-overlay-heart {
  transform-origin: top left;
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
}

/* ------------------------------------ */
.block4:hover .block4-overlay {
  visibility: visible;
  opacity: 1;
}

.block4:hover .block4-overlay-txt {
  bottom: 0;
}

.block4:hover .block4-overlay-heart {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}


/*[ BG Title Page ]
///////////////////////////////////////////////////////////
*/
.bg-title-page {
  width: 100%;
  min-height: 239px;
  padding-left: 15px;
  padding-right: 15px;
  background-repeat: no-repeat;
  background-position: center 0;
  background-size: cover;
}

@media (max-width: 576px) {
  .bg-title-page .l-text2 {font-size: 35px;}
  .bg-title-page .m-text13 {font-size: 16px;}
}

/*[ rs NoUI ]
///////////////////////////////////////////////////////////
*/
.leftbar #filter-bar {
  margin-right: 6px;
  margin-left: 6px;
  height: 4px;
  border: none;
  background-color: #e1e1e1;
}
.leftbar #filter-bar .noUi-connect {
  background-color: #c5c5c5;
  border: none;
  box-shadow: none;
}
.leftbar #filter-bar .noUi-handle {
  width: 13px;
  height: 13px;
  left: -6px;
  top: -5px;
  border: none;
  border-radius: 50%;
  background: #999999;
  cursor: pointer;
  box-shadow: none;
  outline: none;
}
.leftbar #filter-bar .noUi-handle:before {
  display: none;
}
.leftbar #filter-bar .noUi-handle:after {
  display: none;
}

/*[ Filter Color ]
///////////////////////////////////////////////////////////
*/
.color-filter1 {background-color: #00bbec;}
.color-filter2 {background-color: #2c6ed5;}
.color-filter3 {background-color: #ffa037;}
.color-filter4 {background-color: #ff5337;}
.color-filter5 {background-color: #a88c77;}
.color-filter6 {background-color: #393939;}
.color-filter7 {background-color: #cccccc;}

.checkbox-color-filter {
  display: none;
}

.color-filter {
    display:block;
    width:25px;
    height:25px;
    cursor:pointer;
    border-radius: 50%;
}

.checkbox-color-filter:checked + .color-filter {
  box-shadow: 0 0 0px 2px black;
  -moz-box-shadow: 0 0 0px 2px black;
  -webkit-box-shadow: 0 0 0px 2px black;
  -o-box-shadow: 0 0 0px 2px black;
  -ms-box-shadow: 0 0 0px 2px black;
}

/*[ Pagination ]
///////////////////////////////////////////////////////////
*/
.pagination {
  margin-right: -6px;
  margin-left: -6px;
}

.item-pagination {
  font-family: Montserrat-Regular;
  font-size: 13px;
  color: #808080;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #eeeeee;
  margin: 6px;
}

.item-pagination:hover {
  background-color: #222222;
  color: white;
}

.active-pagination {
  background-color: #222222;
  color: white;
}


/*[ Slick3 ]
///////////////////////////////////////////////////////////
*/

.wrap-slick3-dots {
  width: 14.5%;
}

.slick3 {
  width: 80.64%;
}

.slick3-dots li {
  display: block;
  position: relative;
  width: 100%;
  margin-bottom: 15px;
}

.slick3-dots li img {
  width: 100%;
}

.slick3-dot-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  border: 3px solid transparent;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.slick3-dot-overlay:hover {
  border: 3px solid #888888;
}

.slick3-dots .slick-active .slick3-dot-overlay {
  border: 3px solid #888888;
}


/*[ Dropdown content ]
///////////////////////////////////////////////////////////
*/
.show-dropdown-content .down-mark {
  display: block;
}

.show-dropdown-content .up-mark {
  display: none;
}


/*[ Cart ]
///////////////////////////////////////////////////////////
*/
/*[ Table ]
-----------------------------------------------------------
*/
.wrap-table-shopping-cart {
  overflow: auto;
}

.container-table-cart::before {
  content: '';
  display: block;
  position: absolute;
  width: 1px;
  height: calc(100% - 51px);
  background-color: #e6e6e6;
  top: 51px;
  left: 0;
}

.container-table-cart::after {
  content: '';
  display: block;
  position: absolute;
  width: 1px;
  height: calc(100% - 51px);
  background-color: #e6e6e6;
  top: 51px;
  right: 0;
}

.table-shopping-cart {
  border-collapse: collapse;
  width: 100%;
  //min-width: 992px;
}

.table-shopping-cart .table-row {
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}

.table-shopping-cart .column-1 {
  width: 225px;
  padding-left: 50px;
}
.table-shopping-cart .column-2 {
  width: 330px;
  padding-right: 30px;
}
.table-shopping-cart .column-3 {
  width: 133px;
  padding-right: 30px;
}
.table-shopping-cart .column-4 {
  width: 355px;
  padding-right: 30px;
}
.table-shopping-cart .column-4 button.remove {
	background: transparent;
	color: #222222;
	border: 1px solid #222222;
	text-transform: uppercase;
}
.table-shopping-cart .column-5 {
  padding-right: 30px;
}

.table-shopping-cart .table-head th {
  font-family: Montserrat-Bold;
  font-size: 13px;
  color: #555555;
  line-height: 1.5;
  text-transform: uppercase;
  padding-top: 16px;
  padding-bottom: 16px;
}

.table-shopping-cart td {
  font-family: Montserrat-Regular;
  font-size: 16px;
  color: #555555;
  line-height: 1.5;
  padding-top: 37px;
  padding-bottom: 30px;
}

@media (max-width: 1000px) {

	.table-shopping-cart .column-2 {
		width: 33%;
		padding-left: 10px;
		padding-right: 10px;
	}

	.table-shopping-cart .column-4 {
		padding-right: 0;
	}

	.table-shopping-cart .column-1,
	.table-shopping-cart .column-3  {
		display: none;
	}
}

.table-shopping-cart .table-row .column-2 {
  font-size: 15px;
}


/* ------------------------------------ */
.cart-img-product {
  width: 90px;
  position: relative;
}

.cart-img-product img {
  width: 100%;
}

.cart-img-product::after {
  content: '\e870';
  font-family: Linearicons;
  font-size: 16px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  color: white;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  -moz-transition: all 0.3s;
  opacity: 0;
}

.cart-img-product:hover:after {
  cursor: pointer;
  opacity: 1;
}


/*[ Tags ]
///////////////////////////////////////////////////////////
*/
.wrap-tags {
  margin-right: -3px;
  margin-left: -3px;
}

.tag-item {
  display: block;
  font-family: Montserrat-Regular;
  font-size: 13px;
  color: #888888;
  line-height: 1.5;
  padding: 5px 15px;
  border: 1px solid #cccccc;
  border-radius: 15px;
  margin: 3px;
}

.tag-item:hover {
  border: 1px solid {{ settings.color_skin }};
}


/*[ tab01 ]
///////////////////////////////////////////////////////////
*/
.tab01 .nav-tabs {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-bottom: none;
  margin-right: -15px;
  margin-left: -15px;
}

.tab01 .nav-tabs .nav-item {
  padding: 8px 16px;
}

.tab01 .nav-link {
  padding: 0;
  border-radius: 0px;
  border: none;
  border-bottom: 1px solid transparent;
  font-family: Montserrat-Regular;
  font-size: 15px;
  color: #888888;
  line-height: 1.1;
}

.tab01 .nav-link.active {
    color: #333333;
    border-bottom: 1px solid #6a6a6a;
}

.tab01 .nav-link:hover {
    color: #333333;
    border-bottom: 1px solid #6a6a6a;
}

@media (max-width: 480px) {
  .tab01 .nav-tabs .nav-item {
    padding: 8px 6px;
  }

  .tab01 .nav-tabs {
    margin-right: -6px;
    margin-left: -6px;
  }
}


/*[ Modal video 01 ]
///////////////////////////////////////////////////////////
*/
body {padding-right: 0px !important;}

.modal {
  padding: 0px !important;
  z-index: 1360;
  overflow-x: hidden;
  overflow-y: auto !important;
}
.modal-open {overflow-y: scroll;}

/* ------------------------------------ */
.modal-backdrop {
  background-color: transparent;
}

#modal-video-01 {
  background-color: rgba(0,0,0,0.8);
  z-index: 1350;

}

#modal-video-01 .modal-dialog {
  max-width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
}

.wrap-video-mo-01 {
  width: 854px;
  height: auto;
  position: relative;
  margin: 15px;
}

.video-mo-01 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  -webkit-transition: all 2s;
  -o-transition: all 2s;
  -moz-transition: all 2s;
  transition: all 2s;
}

.video-mo-01 iframe {
  width: 100%;
  height: 100%;
}

.close-mo-video-01 {
  font-size: 50px;
  color: white;
  opacity: 0.6;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1250;
  width: 60px;
  height: 60px;
  top: 0;
  right: 0;
}

.close-mo-video-01:hover {
  cursor: pointer;
  opacity: 1;
}


/*[ Input NumProduct ]
///////////////////////////////////////////////////////////
*/
input.num-product {
    -moz-appearance: textfield;
    appearance: none;
    -webkit-appearance: none;
}

input.num-product::-webkit-outer-spin-button,
input.num-product::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Footer */

footer#footer {
  background-color: {{ settings.color_footer }};
}

#footer h4.s-text12 {
  color: {{ settings.color_footer_heading }};
}

#footer a {
  color: {{ settings.color_footer_links }};
}

#footer a.footer-social-button {
  color: {{ settings.color_social_links }};
}
#footer .s-text7 {
  color: {{ settings.color_footer_text }};
}
button:disabled {
  background-color: {{ settings.color_skin }} !important;
  width: 100%;
  opacity: .7;
  cursor: default;
}

/* Countdown timer */
.countdown-timer > div{
	background: {{ settings.color_countdown }};
}
.countdown-timer > div > span {
	color: {{ settings.color_countdown_text }};
}

/* Instagram Section */
section.instagram .owl-carousel .block4 {
	width: 100%;
	height: 0;
	padding-bottom: 100%;
	background: no-repeat 50% 50%;
	background-size: cover;
}


@media (max-width: 480px) {
	.countdown-timer > div{
		width: 46px;
		height: 46px;
	}
}

@media (max-width: 480px) {
	.footer__columns {
		text-align: center;
	}

	.footer__social-icons {
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
	}

	.footer__social-icons > a:last-child {
		padding-right: 0;
	}

	#subscribe input {
		text-align: center;
	}

	#subscribe .w-size2,
	#subscribe .w-size9 {
		width: 100%;
		max-width: none;
	}
}


`;

const modifiedCss = removeFontDisplay(inputCss);
console.log(modifiedCss);
