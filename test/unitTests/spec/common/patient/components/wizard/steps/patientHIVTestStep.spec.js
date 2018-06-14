describe('patientHIVTestStep', function () {

  var $componentController, patientService, $q, $rootScope, sessionService, configurationService;

  beforeEach(module('common.patient', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_, _configurationService_) {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
    configurationService = _configurationService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {
      spyOn(patientService, 'getPersonAttributesForStep').and.returnValue([1,2,3,4]);
    });

    it('should set it self as wizard current step', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientHIVTestStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

    it('should get person attributes for testing step', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientHIVTestStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      expect(ctrl.patientAttributes).toEqual([1,2,3,4]);

    });

  });

});
