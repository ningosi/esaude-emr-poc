(function () {
  'use strict';

  angular.module('patient.details')
    .controller('DetailPatientController', DetailPatientController);

  DetailPatientController.$inject = ["$stateParams", "$location", "$scope", "reportService", "patientService",
    "notifier", "translateFilter", "configurations"];

  function DetailPatientController($stateParams, $location, $scope, reportService, patientService, notifier,
                                   translateFilter, configurations) {

    var patientUUID = $stateParams.patientUuid;
    var patientConfiguration = $scope.patientConfiguration;


    var vm = this;

    vm.patient = {};
    vm.addressLevels = configurations.addressLevels();
    vm.patientAttributes = [];
    vm.linkDashboard = linkDashboard;
    vm.print = print;

    activate();

    ////////////////

    function activate() {
      getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
          vm.patientAttributes = patientConfiguration.customAttributeRows().reduce(function (acc, cur) {
            return acc.concat(cur);
          }, []);
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkDashboard() {
      $location.url("/dashboard/" + patientUUID); // path not hash
    }

    function print() {
      reportService.printPatientDailyHospitalProcess(vm.patient);
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }
})();
