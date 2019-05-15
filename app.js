// App: modelo de desarrollo urbano
// Desarrollo: Lic. Carlos Garcia / carlosgctes@gmail.com
// Ultima modif.: 17/04/2018
// ---
var frente                    = undefined;
var largo                     = undefined;
var retiroLateral             = undefined;
var supSemiCubPtaTipoFuste    = undefined;
var superficieTerreno         = undefined;  // superficie terreno
var retiroFrente              = $("#retiroFrente").val();
var nroPisoBas                = $("#nroPisoBas").val(); // nroPisoBas
var retiroDeFondo             = undefined;
var alturaMaxima              = undefined;
var nroPisos                  = undefined;
var nroPisoFus                = undefined;
var supCubEdifPB              = undefined;
var supCubEdifEnBas           = undefined;
var supCubPtaTipoFuste        = undefined; // Sup. cubierta planta tipo fuste:
var supSemiCubFOTPtaTipoFuste = undefined; // Sup. Semicubierta para FOT Planta Tipo Fuste:
var supSinFOTPtaTipoFuste     = undefined; // Sup. sin FOT Planta Tipo Fuste:
var supFusteParaFot           = undefined; // sup Fuste para FOT.
var supTotalConsSinFot        = undefined; // Sup. Total Construida sin FOT:
var supTotalConstruida        = undefined; // superficie total construida
var fot                       = undefined; // FOT
var fotSegunNorma             = $("#fotSegunNorma").val();
var supMaxSegunFOT            = undefined;
var fosSegunNorma             = $("#fosSegunNorma").val();
var fos                       = undefined;

$(document).ready(function(e){

	$("#frente").focus();

	$("#btnCalcular").click(function(e){
		// controlo los valores ingresados
		e.preventDefault();

		frente                    = $("#frente").val();
		largo                     = $("#largo").val();
		retiroFrente              = $("#retiroFrente").val();
		retiroLateral             = $("#retiroLateral").val();
		supSemiCubPtaTipoFuste    = $("#supSemiCubPtaTipoFuste").val();
		nroPisoBas                = $("#nroPisoBas").val(); // nroPisoBas
		fotSegunNorma             = $("#fotSegunNorma").val();
		fosSegunNorma             = $("#fosSegunNorma").val();

		// algunos controles de validacion
		// valida que frente y fondo no esten vacios
		if(frente =='' || frente.length==0){
			$.msgBox("Es necesario ingresar un valor para el <b>Frente</b>.",{
				type: "error",
				bottons: [{type: "submit", value: "Cerrar"}]
			});
			$("#frente").focus();
			return;
		}

		if(largo=='' || largo.length==0){
			$.msgBox("Es necesario ingresar un valor para el <b>Largo</b>",{
				type: "error",
				bottons: [{type: "submit", value: "Cerrar"}]
			},function(){alert('funcion ejecutada');});
			$("#largo").focus();
			return;
		}
		
		// controlo el valor del retiro de frente, segun el frente del terreno
		if(frente < 10 && retiroFrente > 3){
			$.msgBox("El valor de <b>Retiro lateral</b> no es valido para el valor de <B>Frente</b> ingresado.",{
				type: "error",
				bottons: [{type: "submit", value: "Cerrar"}]
			});
			return;
		}

		// superficie terreno
		if(frente > 0 && largo > 0){
			superficieTerreno = (frente * largo);
			$("#resSupTerreno").html(superficieTerreno);
		}
		
		// tipologia permitida
		$("#resTopolPermitida").html(emlPermitida(frente));

		// sup. minima de parcela
		$("#resSupMinParcela").html(supMinParcela(frente));

		// retiro lateral

		// retiro de fondo
		retiroDeFondo = (largo * 0.2);
		$("#resRetiroFondo").html(retiroDeFondo);

		// altura Maxima
		if(retiroFrente>0 && frente>0){
		  alturaMaxima = fAlturaMaxima(frente, retiroFrente);
		  $("#resAlturaMaxima").html(alturaMaxima);
		}

		// nro de piso permitido
		nroPisos = (alturaMaxima / 3);
		$("#resNroPisos").html(nroPisos);

		// Nro pisos FUS
		if(nroPisoBas > 0 && alturaMaxima > 0 && nroPisos > 0){
			nroPisoFus = ((alturaMaxima / 3) - nroPisoBas);
			$("#resNroPisoFus").html(nroPisoFus);
		}

		// Sup cubierta edificable en PB
		if($("#fondo").val() > 0 && superficieTerreno > 0 && retiroDeFondo > 0){
			supCubEdifPB = (superficieTerreno - (retiroDeFondo * $("#fondo").val()));
			$("#resSupCubEdifPB").html(supCubEdifPB);
		}

		// superficie cubierta edificable en basamento
		if(supCubEdifPB > 0 && nroPisoBas > 0){
			supCubEdifEnBas = supCubEdifPB * nroPisoBas;
			$("#resSupCubEdifEnBasamento").html(supCubEdifEnBas);
		}

		// superficie cubierta planta tipo fuste
		if(superficieTerreno>0 && frente>0 && retiroFrente>0 && largo>0 && fondo>0 && retiroLateral>0){
			supCubPtaTipoFuste = (superficieTerreno-((rente * retiroFrente)+((0.3 * largo * fondo)+(retiroLateral * (largo - retiroFrente - 0.3 * largo)))));
			$("#resSupCubPlantaTipoFuste").html(supCubPtaTipoFuste);
		}

		// Sup. Semicubierta para FOT Planta Tipo Fuste:
		if(supSemiCubPtaTipoFuste>0){
			supSemiCubFOTPtaTipoFuste = supCubPtaTipoFuste * 0.5;
			$("#resSupSemiCubFOTPtaTipoFuste").html(supSemiCubFOTPtaTipoFuste);
		}

		// Sup. sin FOT Planta Tipo Fuste:
		if(supCubPtaTipoFuste > 0 && supSemiCubPtaTipoFuste > 0 && nroPisoBas > 0){
			supSinFOTPtaTipoFuste = (supCubPtaTipoFuste + supSemiCubPtaTipoFuste) * nroPisoBas;
			$("#resSupSinFOTPtaTipoFuste").html(supSinFOTPtaTipoFuste);
		}

		// sup Fuste para FOT
		if(supCubPtaTipoFuste  > 0 && supSemiCubFOTPtaTipoFuste > 0){
			supFusteParaFot = (supCubPtaTipoFuste + supSemiCubFOTPtaTipoFuste) * nroPisoBas;
			$("#resSupFusteParaFot").html(supFusteParaFot);
		}

		// Sup. Total Construida sin FOT:
		if(supCubEdifEnBas > 0 && supSinFOTPtaTipoFuste > 0){
			supTotalConsSinFot = supCubEdifEnBas + supSinFOTPtaTipoFuste;
			$("#resSupTotalConsSinFot").html(supTotalConsSinFot);
		}

		// superficie total construida.
		if(supCubEdifEnBas > 0 && supFusteParaFot > 0){
			supTotalConstruida = supCubEdifEnBas + supFusteParaFot;
			$("#resSupTotalConstruida").html(supTotalConstruida);
		}

		// FOT
		if(supTotalConstruida > 0 && superficieTerreno > 0){
			fot = supTotalConstruida + superficieTerreno;
			$("#resFot").html(fot);
		}

		// Sup. Maxima segun FOT
		if(fotSegunNorma > 0 && superficieTerreno > 0){
			supMaxSegunFOT = fotSegunNorma * superficieTerreno;
			$("#resSupMaxSegunFOT").html(supMaxSegunFOT);
		}

		// FOS
		if(supCubEdifPB > 0 && superficieTerreno > 0){
			fos = supCubEdifPB / superficieTerreno;
			$("#resFos").html(fos);
		}

	});
});

function emlPermitida(valor){
	var ret = '';

	if(valor >= 0 && valor < 15){
		ret = 'EM';
	} else if(valor >= 15 && valor < 24){
		ret = 'SPM';
	} else if(valor >= 24){
		ret = 'PM';
	} else {
		ret = 'Sin dato';
	}

	return ret;
}

function supMinParcela(valor){
	var ret = '';

	if(valor >= 10 && valor < 15){
		ret = '300';
	} else if(valor >= 15 && valor < 24){
		ret = '600';
	} else if(valor >= 24){
		ret = '800';
	} else {
		ret = '';
	}

	return ret;
}

function retiroFrente(valor){
	var ret = '';

	if(valor >= 10 && valor < 15){
		ret = '300';
	} else if(valor >= 15 && valor < 24){
		ret = '600';
	} else if(valor >= 24){
		ret = '800';
	} else {
		ret = '';
	}

	return ret;
}

function fAlturaMaxima(frente, retiroFrente){
	var ret = 0;

	if(frente >= 0 && frente < 10){
		ret = 12;
	} else if(frente >= 10 && frente < 15){

		if(retiroFrente == 3){
			ret = 18;
		} else if(retiroFrente == 5){
			ret = 24;
		} else if(retiroFrente == 7){
			ret = 36;
		} else {
			ret = 21
		}

	} else if(frente == 15){

		if(retiroFrente == 5){
			ret = 24;
		} else if(retiroFrente == 7){
			ret = 36;
		} else {
			ret = 21;
		}

	} else if(frente >= 16 && frente < 24){
		if(retiroFrente == 7){
			ret = 42;
		} else if(retiroFrente == 5){
			ret = 36;
		} else {
			ret = 24;
		}
	} else {
		ret = 45;
	}

  return ret;
}
