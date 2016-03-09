'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$scope', '$location', 'patient', 'patientService', 
                    'appService', '$http',
        function ($scope, $location, patientModel, patientService, appService, $http) {
                
                $scope.actions = {};
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.srefPrefix = "newpatient.";
                    $scope.patient = patientModel.create();
                })();
                
                $scope.getDeathConcepts = function () {
                    var deathConcept;
                    var deathConceptValue;
                    $http({
                        url: '/openmrs/ws/rest/v1/systemsetting',
                        method: 'GET',
                        params: {
                            q: 'concept.causeOfDeath',
                            v: 'full'
                        },
                        withCredentials: true,
                        transformResponse: [function(data){
                            deathConcept = JSON.parse(data);
                            deathConceptValue = deathConcept.results[0].value;
                            $http.get(Bahmni.Common.Constants.conceptUrl, {
                                params: {
                                    q: deathConceptValue,
                                    v: 'custom:(uuid,name,set,answers:(uuid,display,name:(uuid,name),retired))'
                                },
                                withCredentials: true
                            }).then(function (results) {
                                $scope.deathConcepts = results.data.results[0]!=null ? results.data.results[0].answers:[];
                                $scope.deathConcepts = filterRetireDeathConcepts($scope.deathConcepts);
                            });
                        }]
                    });
                };
                
                var filterRetireDeathConcepts = function(deathConcepts){
                    return _.filter(deathConcepts,function(concept){
                        return !concept.retired;
                    });
                };
                
                $scope.selectIsDead = function(){
                    if($scope.patient.causeOfDeath != null ||$scope.patient.deathDate != null){
                        $scope.patient.dead = true;
                    }
                };

                $scope.disableIsDead = function(){
                    return ($scope.patient.causeOfDeath != null || $scope.patient.deathDate != null) && $scope.patient.dead;
                };
                
                $scope.initAttributes = function() {
                    $scope.patientAttributes = [];
                    angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                        angular.forEach(value, function (value) {
                            $scope.patientAttributes.push(value);
                        });
                    });
                };
                
                $scope.save = function () {
                    var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                    if(errMsg){
    //                   messagingService.showMessage('formError', errMsg);
                        return;
                    }

                    patientService.create($scope.patient).success(successCallback);
                };
                
                var successCallback = function (patientProfileData) {
                    $scope.patient.uuid = patientProfileData.patient.uuid;
                    $scope.patient.name = patientProfileData.patient.person.names[0].display;
                    $scope.patient.isNew = true;
                    $location.url("/dashboard/" + $scope.patient.uuid);
                };
        }]);
