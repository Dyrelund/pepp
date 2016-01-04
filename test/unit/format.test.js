"use strict";
process.env.NODE_ENV = 'test';
process.env.FORMAT = "csv";

const _ = require('underscore');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const format = require('../../lib/format');


describe("Format - JSON to CSV", function(){

    it('nested child array format', function() {

        let config = [
                {
                    "booboo-1451606400-male": [
                        {
                            "key": "25-34",
                            "interactions": 1628600,
                            "unique_authors": 914000
                        },
                        {
                            "key": "18-24",
                            "interactions": 1454700,
                            "unique_authors": 695800
                        }
                    ],
                    "yogi-1448928000-female": [
                        {
                            "key": "25-34",
                            "interactions": 2955400,
                            "unique_authors": 2411600
                        },
                        {
                            "key": "35-44",
                            "interactions": 2620300,
                            "unique_authors": 1987500
                        }
                    ],
                    "yogi-1448928000-male": [
                        {
                            "key": "25-34",
                            "interactions": 2109900,
                            "unique_authors": 1533100
                        },
                        {
                            "key": "35-44",
                            "interactions": 1618500,
                            "unique_authors": 1157100
                        }
                    ]
                }
            ];

        return format.jsonToCsv(config).then(function(result){

            expect(result).to.be.an('string');
            expect(result).to.eql('category,key,interactions,unique_authors\n' +
                'booboo-1451606400-male,25-34,1628600,914000\n' +
                'booboo-1451606400-male,18-24,1454700,695800\n' +
                'yogi-1448928000-female,25-34,2955400,2411600\n' +
                'yogi-1448928000-female,35-44,2620300,1987500\n' +
                'yogi-1448928000-male,25-34,2109900,1533100\n' +
                'yogi-1448928000-male,35-44,1618500,1157100\n');
        });
    });

    it('child array format', function() {

        let config = [
            {
                "25-34": [
                    {
                        "key": 1448841600,
                        "interactions": 280300,
                        "unique_authors": 220300
                    },
                    {
                        "key": 1449446400,
                        "interactions": 575300,
                        "unique_authors": 402400
                    }
                ],
                "18-24": [
                    {
                        "key": 1448841600,
                        "interactions": 259900,
                        "unique_authors": 188600
                    },
                    {
                        "key": 1449446400,
                        "interactions": 443900,
                        "unique_authors": 300400
                    }
                ]
            }
        ];


        return format.jsonToCsv(config).then(function(result){

            expect(result).to.be.an('string');
            expect(result).to.eql('category,key,interactions,unique_authors\n' +
                '25-34,1448841600,280300,220300\n' +
                '25-34,1449446400,575300,402400\n' +
                '18-24,1448841600,259900,188600\n' +
                '18-24,1449446400,443900,300400\n');
        });
    });

});