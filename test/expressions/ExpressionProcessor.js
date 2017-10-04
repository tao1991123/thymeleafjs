/* 
 * Copyright 2017, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
	processExpression,
	processIterationExpression,
	processLinkExpression
} from '../../src/expressions/ExpressionProcessor';

import {assert} from 'chai';

/**
 * Tests for the expression processor.
 */
describe('expressions/ExpressionProcessor', function() {

	describe('Object navigation expressions', function() {

		const context = {
			greeting: 'Good morning!',
			greetings: {
				hello: 'Hello :)',
				goodbye: 'Goodbye :(',
				goodnight: null
			}
		};

		it('Simple object navigation', function() {
			let result = processExpression('${greeting}', context);
			assert.strictEqual(result, context.greeting);
		});

		it('Complex object navigation', function() {
			let result = processExpression('${greetings.hello}', context);
			assert.strictEqual(result, context.greetings.hello);
		});

		it('null/undefined value handling', function() {
			let result = processExpression('${greetings.goodnight}', context);
			assert.strictEqual(result, '');
		});

		it('No context handling', function() {
			let result = processExpression('${greeting}');
			assert.strictEqual(result, '');
		});
	});


	describe('Link expressions', function() {

		it('Leaves URLs without special parameters alone', function() {
			let url = '/test';
			let result = processLinkExpression(`@{${url}}`);
			assert.strictEqual(result, url);
		});

		it('Append special parameters', function() {
			let context = {
				greeting: 'hello'
			};
			let url = '/test';
			let params = {
				param1: 'hard-coded-value',
				param2: '${greeting}'
			};

			let paramsAsLinkExpressionSyntax = Object.entries(params)
				.map(([key, value]) => `${key}=${value}`)
				.join(',');
			let result = processLinkExpression(`@{${url}(${paramsAsLinkExpressionSyntax})}`, context);

			let paramsAsQuerySyntax = Object.entries(params)
				.map(([key, value]) => `${key}=${processExpression(value, context)}`)
				.join('&');
			assert.strictEqual(result, `${url}?${paramsAsQuerySyntax}`);
		});
	});


	describe('Iteration expressions', function() {

		it('Value and local name mapping', function() {
			let items = ['a', 'b', 'c'];
			let expression = 'item: ${items}';
			let result = processIterationExpression(expression, { items });
			assert.strictEqual(result.localValueName, 'item');
			assert.strictEqual(result.iterable, items);
		});
	});


	it('Verbatim expressions (fallback)', function() {
		let greeting = 'Hello!';
		let result = processExpression(greeting);
		assert.strictEqual(result, greeting);
	});
});
