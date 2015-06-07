require 'quality/rake/task'

Quality::Rake::Task.new do |t|
  t.output_dir = 'metrics'
  t.verbose = true
  t.extra_files = ['*.js', 'Rakefile']
end

task default: :quality
