var homePageController = startupSmb.controller('homePageController',
    ['$scope', '$uibModal', '$timeout', 'serviceForApiCall', '$cookies','$rootScope',
        function ($scope, $uibModal, $timeout, serviceForApiCall, $cookies,$rootScope) {
            $scope.openRegisterModal = function(){
                $uibModal.open({
                    templateUrl: 'signupModal.html',
                    controller: ['$scope', '$uibModalInstance', 'serviceForApiCall', 'md5', '$cookies', '$timeout',
                        function ($scope, $uibModalInstance, serviceForApiCall, md5, $cookies, $timeout) {
                            $scope.emailRegEx = /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]{0,4}$/;
                            $scope.passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");

                            $scope.loginState = 'signup';
                            $scope.signUp = function () {
                                var data = angular.extend({}, $scope.signUpDetails);
                                data.password = md5.createHash(data.password);
                                $scope.signupLoader = true;
                                serviceForApiCall.signUp(data).then(function (response) {
                                    var expireDate = new Date();
                                    //after 5 hrs automatically signout
                                    expireDate.setTime(expireDate.getTime() + (300 * 60 * 1000));
                                    $cookies.put('loggedIn', true, {'expires': expireDate});
                                    $scope.info = response.data.message;
                                    $uibModalInstance.close();
                                    $scope.signUpDetails = {};
                                    $scope.submit = false;
                                    $scope.signupLoader = false;
                                }, function (error) {
                                    if (error.data.status == 409) {
                                        $scope.error = "User already exist.Try with another email Id "
                                    } else {
                                        $scope.error = 'Something went wrong.'
                                    }
                                    $scope.submit = false;
                                    $scope.signupLoader = false;
                                })
                            };

                            $scope.signIn = function () {
                                var data = angular.extend({}, $scope.signInDetails);
                                data.password = md5.createHash(data.password);
                                $scope.signupLoader = true;
                                serviceForApiCall.login(data).then(function (response) {
                                    var expireDate = new Date();
                                    //after 5 hrs automatically signout
                                    expireDate.setTime(expireDate.getTime() + (300 * 60 * 1000));
                                    $cookies.put('loggedIn', true, {'expires': expireDate});
                                    $uibModalInstance.close();
                                    $scope.signInDetails = {};
                                    $scope.submit = false;
                                    $scope.signupLoader = false;
                                }, function (error) {
                                    if (error.data.status == 401) {
                                        $scope.error = 'Incorrect password';
                                    } else {
                                        $scope.error = 'Something went wrong.'
                                    }
                                    $scope.submit = false;
                                    $scope.signupLoader = false;
                                })
                            };

                            $scope.toggleLogin = function (state) {
                                $scope.signInDetails = {};
                                $scope.signUpDetails = {};
                                $scope.loginState = state;
                                $scope.error = "";
                                $scope.info = "";
                            }
                            $scope.close = function () {
                                $uibModalInstance.close();
                            }
                        }],
                    backdrop: 'static',
                    windowClass: "signupModal",
                    keyboard: false

                }).result.then(function (data) {

                });
            }

            if (!$cookies.get('loggedIn')) {
                $scope.openRegisterModal();
            }

            $scope.profiles = [
                {
                    "name": "Small Business Owner in Retail and Online",
                    "icon": "Small Business ownerimage.png",
                    "desc": "Mike owns a small brick-and-mortar store and sells online. He is not technology shy and is looking for solutions to scale his business",
                    "questions": [
                        "How do I get discovered and grow more customers – offline & online?",
                        "How do I reduce complexity of managing multiple ECom marketplaces? Can I sell globally?",
                        "How do I reduce my shipping costs and manage returns?"
                    ],
                    "similarProfiles": [
                        "Fashion boutiques & retailers",
                        "Small sized traders and exporters"
                    ]
                },
                {
                    "name": "Small Professional services firm",
                    "icon": "Small professional services firm image.png",
                    "desc": "Flourishing services business with 1-2 owners & 3-4 support staff. Looking for solutions to enhance productivity & manage practice better",
                    "questions": [
                        "How do I manage my practice better? Appointment management, scheduling and payments",
                        "Do I know my customers well enough? How do I grow them?",
                        "Which solutions can I use to manage my documents and increase productivity"
                    ],
                    "similarProfiles": [
                        "Accounting, & Legal firms",
                        "Healthcare Professionals",
                        "Small Consulting firms"
                    ]
                },
                {
                    "name": "Mid-sized manufacturers",
                    "icon": "mid sized manufacturer image.png",
                    "desc": "Directors/ department heads of mid-sized manufacturing company. Looking for more customer insights to manage his relationships better",
                    "questions": [
                        "Which are the tools to enhance my customer insights and manage relationships",
                        "How can I manage my documents securely and reduce shipping costs",
                        "How do I improve my business productivity?"
                    ],
                    "similarProfiles": [
                        "Small sized real-estate, manufacturing",
                        "Distributors"
                    ]
                },
                {
                    "name": "Small hyperlocal food delivery business",
                    "icon": "Small Hyperlocal image.png",
                    "desc": "Ben is an owner of a popular local Pizzeria. His sales are predominantly offline with a growing online delivery business",
                    "questions": [
                        "How do I get discovered locally and target my customers?",
                        "How can I scale my delivery business?",
                        "What can I do to reduce my costs and drive more efficiency?"
                    ],
                    "similarProfiles": [
                        "Small food outlets",
                        "Local service businesses: laundry, groceries & home services"
                    ]
                }
            ]


            $(document).ready(function () {

                $(".single-item").slick();

                $(".single-item2").slick({
                    autoplay: true,
                    autoplaySpeed: 1000,
                    dots: true,
                    arrows: false
                });

                $('.multiple-items').slick({
                    infinite: true,
                    slidesToShow: 5,
                    slidesToScroll: 5

                });

            });

        }]);