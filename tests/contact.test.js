'use strict';

const supertest = require('supertest');
const test = require('unit.js');
const app = require('../src/app');
const request = supertest(app);
const AWS = require("aws-sdk");
const AWSMock = require('aws-sdk-mock');

const info = {
  name: "テスト太郎",
  email: "test@test.com",
  questionnaire: "answer1",
  category: 'category2',
  message: '問い合わせ'
};

describe('Test contact controller', function () {
  before(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB', 'createTable', function (params, callback){
      callback(null, "successfully create table in database");
    });
    AWSMock.mock('DynamoDB', 'deleteTable', function (params, callback){
      callback(null, "successfully drop table in database");
    });
    AWSMock.mock('DynamoDB.DocumentClient', 'put', info);
  });

  it('問い合わせテーブルを作る', function (done) {
    request.post('/api/create').expect(200).end(function (err, result) {
      test.string(result.body.Message).contains('問い合わせテーブルを作成しました');
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      done(err);
    });
  });

  it('問い合わせ内容を送信する', function (done) {
    request.post('/api/save').send(info).expect(200).end(function (err, result) {
      test.string(result.body.Message).contains('問い合わせを送信しました');
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      done(err);
    });
  });

  it('問い合わせテーブルを削除する', function (done) {
    request.post('/api/drop').expect(200).end(function (err, result) {
      test.string(result.body.Message).contains('問い合わせテーブルを削除しました');
      test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
      done(err);
    });
  });
});