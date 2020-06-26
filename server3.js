const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let auth = require("./auth/authentication");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://macal1581012468.zendesk.com"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Accept,Authorization"
  );

  next();
});

app.get("/getinfoclient", auth(), (req, res, next) => {
  console.log(req.body);
  if (req.body.rut == "134893133") {
    res.send({
      success: true,
      message: "",
      obj: {
        PerId: 139638,
        Nombre: "Betsabé Maturana Flores",
        Rut: "134893133",
        Email: "bmaturana@macal.cl",
        Telefono: "56989223598",
        Direccion: "Av. Los Candiles 41",
        EsEmpresa: "No",
        Pais: "Chile",
        Region: "Región Metropolitana",
        Ciudad: "Colina",
        Comuna: "Colina",
        FechaNacimiento: "06-08-1978",
        Remate: {
          RemId: 854,
          Fecha: "03-06-2020 11:00:00",
          Nombre: "Prueba dvl 03/06",
          Tipo: "VEHICULOS",
          Ubicacion: "Online",
          UbicacionExhibicion: "-",
          FechaExhibDesde: "01-06-2020 0:00:00",
          FechaExhibHasta: "02-06-2020 0:00:00",
          Garantia: {
            GtiaId: 55081,
            MontoTotal: "10.000.000",
            Saldo: "9.000.000",
            Estado: "Validada",
            FechaCreación: "17-10-2018 11:19:04",
          },
          Adjudicaciones: [
            {
              LoteId: 76268,
              NumeroLote: 6,
              NombreLote: "CHEVROLET TRACKER II FWD 1,8 2019 KZJY57",
              MontoAdjudicacion: "20",
              EstadoLote: "Facturado",
              NombreFacturador: null,
              RutFacturador: null,
              NumFactura: null,
              SeguroContratado: null,
              GtiaMecanicaContratada: null,
            },
            {
              LoteId: 76303,
              NumeroLote: 2,
              NombreLote: "FORD EXPLORER 2.0 AUT 2015 HBYK50",
              MontoAdjudicacion: "10",
              EstadoLote: "Facturado",
              NombreFacturador: null,
              RutFacturador: null,
              NumFactura: null,
              SeguroContratado: null,
              GtiaMecanicaContratada: null,
            },
            {
              LoteId: 76311,
              NumeroLote: 1,
              NombreLote: "MAZDA CX 5 R 2.0 AUT 2017 JSYD86",
              MontoAdjudicacion: "8.000.000",
              EstadoLote: "En Proforma",
              NombreFacturador: null,
              RutFacturador: null,
              NumFactura: null,
              SeguroContratado: null,
              GtiaMecanicaContratada: null,
            },
          ],
        },
      },
    });
  } else {
    res.send({ msj: "No existe cliente con ese rut ", obj: req.body });
  }
});

app.get("/getrematesbyrut", auth(), (req, res, next) => {
  if (req.body.rut == "134893133") {
    res.send({
      success: true,
      message: "",
      obj: [
        {
          RemId: 854,
          RemNombre: "VEHICULOS 03-06-2020",
        },
      ],
    });
  } else {
    res.send("error");
  }
});

let port = process.env.PORT || "8090";
app.listen(port, () => {
  console.log(`servidor corriendo en puerto ${port}`);
});
